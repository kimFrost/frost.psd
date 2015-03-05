require 'psd'
require 'pp'
require 'json'
require 'multi_json'

file = ARGV[0]
psd = PSD.new(file)
psd.parse!

treeHash = psd.tree.to_hash
#treeHashJson = treeHash.to_json
#treeHashJson = JSON.parse(treeHash.to_json)
treeHashJson = treeHash.to_json(:max_nesting => 100)
puts treeHashJson
