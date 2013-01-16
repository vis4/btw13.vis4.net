require 'jekyll/localization'
Jekyll::Localization::LANGUAGES = %w[de en]

#require "jekyll-sass"



#   class CssCompressor < JekyllAssetPipeline::Compressor
#     require 'yui/compressor'

#     def self.filetype
#       '.css'
#     end

#     def compress
#       return YUI::CssCompressor.new.compress(@content)
#     end
#   end
# end