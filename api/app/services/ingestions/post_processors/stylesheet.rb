module Ingestions
  module PostProcessors
    class Stylesheet < AbstractInteraction
      object :stylesheet

      delegate :raw_styles, to: :stylesheet

      def execute
        info "services.ingestions.post_processor.log.transform_ss",
             name: stylesheet.name,
             id: stylesheet.id
        validate_stylesheet
      end

      private

      def validate_stylesheet
        ::Validator::Stylesheet.new.validate(raw_styles)
      end
    end
  end
end
