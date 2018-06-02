module Ingestions
  mattr_accessor :configuration do
    Ingestions::Configuration::GlobalConfigurator.new
  end

  class << self
    delegate :configure, :strategies, :converters, to: :configuration
  end

  configure do
    converters do
      converter :epub
      converter :document
      converter :manifest
    end

    strategies do
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
end
