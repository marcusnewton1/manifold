module Ingestions
  module Configuration
    # @api private
    class Registry
      include Enumerable

      RELATIVE_INSERTIONS = %i[before after].freeze

      INSERT_TUPLE = ->(o) { o.kind_of?(Array) && o.length == 2 && o.first.in?(RELATIVE_INSERTIONS) && o.second.kind_of?(Symbol) }

      attr_reader :last_position

      delegate :length, :size, to: :@strategy_definitions

      def initialize
        @strategy_definitions = Set.new
        @last_position = 0
      end

      def each
        return enum_for(__method__) unless block_given?

        @strategy_definitions.sort.each do |strategy_definition|
          yield strategy_definition
        end
      end

      # @return [Ingestions::Configuration::StrategyDefinition]
      def [](name)
        find_by_name(name) or raise Ingestions::UnknownStrategy, "Unknown strategy: #{name}"
      end

      # @api private
      # @param [Integer, :first, (:before, Symbol), (:last, Symbol)] position
      # @param [{ Symbol => Object }] options (@see Ingestions::Configuration::StrategyDefinition#initialize)
      # @raise [Ingestions::InvalidStrategy]
      # @return [Ingestions::Configuration::StrategyDefinition]
      def add(position: nil, **options)
        raise Ingestions::ConfigurationError, "Not in a configure block; cannot add directly" unless configuring?

        options[:position] = calculate_position(position)

        definition = Ingestions::Configuration::StrategyDefinition.new options

        raise Ingestions::InvalidStrategy, definition.errors.full_messages.to_sentence unless definition.valid?

        raise Ingestions::StrategyAlreadyDefined, "Strategy already defined: #{definition.name}" unless @strategy_definitions.add?(definition)

        each do |strategy_definition|
          next if strategy_definition == definition

          strategy_definition.position += 1 if strategy_definition.position >= definition.position
        end

        @last_position = to_a.last.position.to_i

        return definition
      end

      def configure(&block)
        @configuring = true

        configurator = Ingestions::Configuration::Configurator.new self

        configurator.evaluate(&block)

        return self
      ensure
        @configuring = false
      end

      def configuring?
        @configuring
      end

      private

      # @param [Integer, :first, (:before, Symbol), (:last, Symbol)] value
      # @return [Integer]
      def calculate_position(value)
        case value
        when :first, 0
          1
        when INSERT_TUPLE
          calculate_relative_insertion_for(*value)
        when Fixnum then value
        when nil then last_position + 1
        else
          raise TypeError, "Unknown value for position: #{value.inspect}"
        end
      end

      # @param [:before, :after] relative_insertion
      # @param [Symbol] relative_to_name
      # @raise [Ingestions::UnknownStrategy]
      # @return [Integer]
      def calculate_relative_insertion_for(relative_insertion, relative_to_name)
        relative_position = self[relative_to_name].position

        case relative_insertion
        when :before
          relative_position
        when :after
          relative_position + 1
        else
          1
        end
      end

      def find_by_name(name)
        detect do |definition|
          definition =~ name
        end
      end
    end
  end
end
