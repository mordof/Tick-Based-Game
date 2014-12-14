require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)

Mongoid.load!("config/mongoid.yml", :development)

# Load all models 
Dir[File.join("./models", "/**/*.rb")].each { |file| 
  unless $LOAD_PATH.include?(File.dirname(file))
    $LOAD_PATH.unshift(File.dirname(file))
  end

  require File.basename(file)
}