module Ingestions
  module Converters
    class Markdown < Ingestions::Converters::AbstractConverter

      def perform
        convert_to_html
      end

      def self.convertible_extensions
        %w(md markdown)
      end

      protected

      def markdown_contents
        @markdown_contents ||= parse_document
      end

      def convert_to_html
        <<~HEREDOC
          <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
              #{metadata}
            </head>
            <body>
              #{body}
            </body>
          </html>
        HEREDOC
      end

      def parse_document
        markdown = context.read(source_path)
        renderer = Redcarpet::Markdown.new(
          Metadown::Renderer.new,
          fenced_code_blocks: true,
          footnotes: true,
          tables: true
        )

        Metadown.render(markdown, renderer)
      end

      def metadata
        metadata_tags.join("\n")
      end

      def body
        markdown_contents.output
      end

      def metadata_tags
        markdown_contents.metadata&.map do |tag, content|
          "<meta name='dc.#{tag}' content='#{content}'>"
        end.presence || []
      end

    end
  end
end
