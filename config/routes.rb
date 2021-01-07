Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  constraints subdomain: 'html' do
    get '/', to: 'practice#index'
  end

  constraints subdomain: 'running-app' do
    get '/', to: 'running_app#index'
  end

  root to: "home#index"

end
