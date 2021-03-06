# Provides a partial serialization of a stylesheet model.
class StylesheetPartialSerializer < ApplicationSerializer
  meta(partial: true)

  attributes :id, :name, :source_identifier, :styles, :ingested, :position,
             :created_at
end
