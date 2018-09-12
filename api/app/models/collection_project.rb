class CollectionProject < ApplicationRecord
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  belongs_to :project_collection
  belongs_to :project

  # Ordering
  acts_as_list scope: :project_collection

  # Scopes
  scope :with_order, ->(order) { order(order) if order.present? }

  # Validation
  validates :project, uniqueness: { scope: :project_collection }
end
