module ProjectCollections
  class CacheCollectionProjects < ActiveInteraction::Base
    record :project_collection

    delegate :featured_only?, to: :project_collection
    delegate :tags, to: :project_collection
    delegate :subjects, to: :project_collection
    delegate :number_of_projects, to: :project_collection
    delegate :projects, to: :project_collection
    delegate :collection_projects, to: :project_collection

    validate :must_be_smart!

    # rubocop:disable Metrics/AbcSize
    def execute
      existing_project_ids = projects.pluck(:id)
      valid_projects = query.limit(number_of_projects)

      collection_projects.where.not(project: valid_projects).destroy_all

      valid_projects.where.not(id: existing_project_ids).each do |project|
        collection_projects.create! project: project
      end

      project_collection.reload
    end
    # rubocop:enable Metrics/AbcSize

    private

    def must_be_smart!
      return if project_collection.smart?

      errors.add :project_collection, "must be a smart collection"
    end

    def query
      base_scope = build_base_scope
      conditions = build_conditions

      return base_scope if conditions.blank?

      filter_scope = conditions.inject(Project.none) do |current_scope, next_scope|
        current_scope.or next_scope
      end

      base_scope.merge filter_scope
    end

    def build_base_scope
      featured_only? ? Project.by_featured(true) : Project.all
    end

    def build_conditions
      [].tap do |array|
        array << Project.by_tag(tags, true) if tags.exists?
        array << Project.by_subject(subjects) if subjects.exists?
      end
    end

  end
end
