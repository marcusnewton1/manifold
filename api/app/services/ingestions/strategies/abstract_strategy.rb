module Ingestions
  module Strategies
    # @abstract
    class AbstractStrategy < ActiveInteraction::Base
      define_model_callbacks :ingestibility_check, :perform

      object :context, class: 'Ingestions::Context'

      boolean :test_only, default: false

      delegate :some, :methods, to: :context

      def execute
        run_callbacks :ingestibility_check do
          @ingestible = determine_ingestibility
        end

        return ingestible? if test_only
        return nil unless ingestible?

        run_callbacks :perform do
          @manifest = perform
        end

        return manifest
      end

      def ingestible?
        @ingestible
      end

      attr_reader :manifest

      # @abstract
      # @return [Boolean]
      def determine_ingestibility
        raise NotImplementedError, "Must implement #{self.class}##{__method__}"
      end

      # @return [Manifest]
      def perform
        raise NotImplementedError, "Must implement #{self.class}##{__method__}"
      end
    end
  end
end
