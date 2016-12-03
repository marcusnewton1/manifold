module Api
  module V1
    # Sections controller
    class TextSectionsController < ApplicationController

      resourceful! TextSection, authorize_options: { except: [:index, :show] }

      def show
        @text_section = load_text_section
        render_single_resource(@text_section)
      end

    end
  end
end
