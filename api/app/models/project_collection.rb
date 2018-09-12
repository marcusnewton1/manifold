class ProjectCollection < ApplicationRecord

  # Concerns
  include Concerns::HasFormattedAttributes
  include Concerns::ValidatesSlugPresence
  include Filterable
  include TrackedCreator

  # Authority
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  include Concerns::Taggable

  # Slugs
  extend FriendlyId
  friendly_id :title, use: :slugged

  # Ordering
  acts_as_list

  # Formatted Attributes
  has_formatted_attribute :description

  # Relationships
  has_many :collection_projects, dependent: :destroy, inverse_of: :project_collection
  has_many :projects, through: :collection_projects
  has_many :project_collection_subjects, dependent: :destroy
  has_many :subjects, through: :project_collection_subjects

  # Scopes
  scope :by_visible, ->(visible) { where(visible: visible) if visible.present? }
  scope :by_show_on_homepage, ->(show) { where(homepage: show) if show.present? }
  scope :with_projects, lambda { |presence|
    where(id: CollectionProject.select(:project_collection_id)) if presence.present?
  }
  scope :with_order, lambda { |by|
    return order(position: :asc) unless by.present?
    order(by)
  }

  # Validation
  validates :title, presence: true, uniqueness: true
  validates :sort_column, :sort_direction, :icon, presence: true

  def sort_order
    { sort_column => sort_direction }
  end

  def sort_order=(order_params)
    self.sort_column, self.sort_direction = order_params.delete(":").split(" ")
  end

  def project_count
    projects.count
  end
end
