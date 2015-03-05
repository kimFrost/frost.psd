require 'psd'
require 'pp'
require 'benchmark'
require 'json'

file = ARGV[0]
psd = PSD.new(file)
psd.parse!

#png = psd.image.to_png
#psd.image.save_as_png './psd_snapshot.png' # writes PNG to disk
#puts "Flattened image exported to ./psd_snapshot.png\n"

results = Benchmark.measure "Image exporting" do
  psd.image.save_as_png 'psd_snapshot.png'
end
puts 'psd_snapshot.png'

#puts "Flattened image exported to ./psd_snapshot.png\n"
#puts Benchmark::CAPTION
#puts results.to_s