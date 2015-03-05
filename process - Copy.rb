f = File.new("process.log", "w")
f.write "=== Hello! ===\n"
STDIN.each_line do |line|
   STDOUT.write line
   f.write line
end