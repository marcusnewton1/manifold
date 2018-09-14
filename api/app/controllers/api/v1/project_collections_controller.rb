module Api
  module V1
    class ProjectCollectionsController < ApplicationController

      INCLUDES = %w(projects projects.creators projects.contributors subjects).freeze

      resourceful! ProjectCollection, authorize_options: { except: [:index, :show] } do
        includes = [
          :projects,
          :subjects,
          { projects: [:creators, :contributors] }
        ]

        ProjectCollection.filter(with_pagination!(project_collection_filter_params),
                                 scope: ProjectCollection.all.includes(includes))
      end

      # GET /project-collections
      def index
        @project_collections = load_project_collections
        render_multiple_resources(
          @project_collections,
          each_serializer: ProjectCollectionSerializer,
          include: INCLUDES
        )
      end

      # GET /project-collections/1
      def show
        @project_collection = load_project_collection
        render_single_resource(@project_collection, include: INCLUDES)
      end

      # POST /project-collections
      def create
        @project_collection =
          authorize_and_create_project_collection(project_collection_params)
        render_single_resource(@project_collection, include: INCLUDES)
      end

      # PATCH/PUT /project-collections/1
      def update
        @project_collection = load_and_authorize_project_collection
        ::Updaters::Default.new(project_collection_params).update(@project_collection)
        render_single_resource(@project_collection, include: INCLUDES)
      end

      # DELETE /projects-collection/1
      def destroy
        @project_collection = load_and_authorize_project_collection
        @project_collection.destroy
      end

      protected

      def scope_for_project_collections
        ProjectCollection.friendly
      end
    end
  end
end
