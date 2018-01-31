require 'rails_helper'

RSpec.describe Event, type: :model do

  it "belongs to a subject" do
    expect(FactoryBot.create(:event).subject).to_not be nil
  end

  it "is invalid without a project" do
    expect(FactoryBot.build(:event, project: nil)).to_not be_valid
  end

  it "is invalid without a subject" do
    expect(FactoryBot.build(:event, subject: nil)).to_not be_valid
  end

  it "has a valid factory" do
    expect(FactoryBot.create(:event)).to be_valid
  end

  context "can be searched", :slow, :elasticsearch do

    it "by title" do
      @event_a = FactoryBot.create(:event, subject_title: "Aquemini")
      @event_b = FactoryBot.create(:event, subject_title: "ATLiens")
      Event.reindex
      Event.searchkick_index.refresh
      results = Event.filter({keyword: "Aquemini"})
      expect(results.length).to be 1
      results = Event.filter({keyword: "ATLiens"})
      expect(results.length).to be 1
    end
  end

  context "can be filtered" do

    before(:each) do
      @event_a = FactoryBot.create(:event, subject_title: "Aquemini", event_type: "TWEET")
      @event_b = FactoryBot.create(:event, subject_title: "Stankonia", event_type: "TWEET")
      @event_c = FactoryBot.create(:event, subject_title: "ATLiens", event_type: "PROJECT_CREATED")
    end

    it "by type" do
      results = Event.filter({type: "TWEET"})
      expect(results.length).to be 2
      results = Event.filter({type: "PROJECT_CREATED"})
      expect(results.length).to be 1
    end
  end

end
