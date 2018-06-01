module Ingestions
  module Configuration
    class StrategyConfigurator
      include Concerns::Configurates

      # @param [Symbol] name
      # @param [Class, nil] strategy
      def initialize(name, strategy = nil, &block)
        strategy ||= "Ingestions::Strategies::#{name.to_s.camelize}".safe_constantize

        raise Ingestions::ConfigurationError, "Strategy class was not provided and could not be derived from #{name}" if strategy.blank?

        @options = {
          name:     name.to_sym,
          strategy: strategy,
        }

        evaluate(&block)
      end

      # @param [String] text
      # @return [void]
      def description(text)
        @options[:description] = text.to_s.strip_heredoc.strip
      end

      expose :description

      # @param [Symbol] name
      # @return [void]
      def insert_after(name)
        @options[:position] = [:after, name]
      end

      expose :insert_after

      # @param [Fixnum] position
      # @return [void]
      def insert_at(position)
        raise TypeError, "Invalid position: #{position}" unless position.kind_of?(Fixnum) && position >= 1

        @options[:position] = position
      end

      expose :insert_at

      # @param [Symbol] name
      # @return [void]
      def insert_before(name)
        @options[:position] = [:before, name]
      end

      expose :insert_before

      # @return [void]
      def insert_first!
        @options[:position] = :first
      end

      expose :insert_first!

      def to_h
        @options
      end
    end
  end
end
