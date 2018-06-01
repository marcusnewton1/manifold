module Ingestions
  module Configuration
    # @api private
    class StrategyDefinition
      include ActiveModel::Model
      include Dux.comparable(:position)
      include Equalizer.new(:name)

      VALID_STRATEGY = Dux.inherits(Ingestions::AbstractStrategy)

      validates :name, :strategy, :position, presence: true
      validates :position, numericality: { integer_only: true, greater_than_or_equal_to: 1 }
      validate :must_have_a_valid_strategy!

      def initialize(name:, strategy:, position:, description: '')
        @name        = name
        @strategy    = strategy
        @position    = position
        @description = ''
      end

      attr_reader :name
      attr_reader :strategy
      attr_accessor :position
      attr_reader :description

      def =~(namelike)
        name.to_s == namelike.to_s
      end

      # @return []
      def call(**inputs)
        @strategy.run(inputs)
      end

      def test(**inputs)
        call(inputs.merge(test_only: true))
      end

      private

      # @return [void]
      def must_have_a_valid_strategy!
        return if VALID_STRATEGY[strategy]

        errors.add :strategy, "does not inherit from Ingestions::AbstractStrategy"
      end
    end
  end
end
