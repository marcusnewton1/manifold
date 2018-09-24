# Serializes a stylesheet model
class StylesheetSerializer < StylesheetPartialSerializer
  meta(partial: false)

  attributes :raw_styles

  belongs_to :text, serializer: TextPartialSerializer
  has_many :text_sections, serializer: TextSectionPartialSerializer

end
