module Ingestions
  class ConfigurationError < StandardError; end
  class InvalidStrategy < ConfigurationError; end
  class StrategyAlreadyDefined < ConfigurationError; end
  class UnknownStrategy < ConfigurationError; end

  mattr_accessor :registry do
    Ingestions::Configuration::Registry.new
  end

  class << self
    delegate :configure, to: :registry
  end

  configure do
    strategy :epub do
      description <<~TEXT
      This is an epub strategy
      TEXT
    end

    strategy :document do
      insert_first!
    end

    strategy :manifest do
      insert_before :epub
    end
  end
end
