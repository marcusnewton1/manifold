module Ingestions
  module Configuration
    class Configurator
      include Concerns::Configurates

      # @param [Ingestions::Configuration::Registry] registry
      def initialize(registry)
        @registry = registry
      end

      # @param [Symbol] name
      # @param [Class] strategy
      # @param
      def strategy(name, strategy = nil, &block)
        configurator = Ingestions::Configuration::StrategyConfigurator.new(name, strategy, &block)

        @registry.add configurator.to_h
      end

      expose :strategy
    end
  end
end
