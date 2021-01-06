Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  constraints subdomain: 'practice' do
    get '/', to: 'practice#index'
  end

  root to: "home#index"
end
