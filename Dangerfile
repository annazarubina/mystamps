# This file is written on Ruby language.
# Here is a quick Ruby overview: http://danger.systems/guides/a_quick_ruby_overview.html
# See also Danger specific methods: http://danger.systems/reference.html

# We we'll use nokogiri for parsing XML
# Here is a good introduction: https://blog.engineyard.com/2010/getting-started-with-nokogiri
# See also a cheat sheet: https://github.com/sparklemotion/nokogiri/wiki/Cheat-sheet
require 'nokogiri'

pwd = Dir.pwd + '/'

def print_errors_summary(program, errors, link = '')
	return if errors == 0
	
	msg = ''
	if errors == 1
		msg = "#{program} reported about #{errors} error. Please, fix it."
	elsif errors > 0
		msg = "#{program} reported about #{errors} errors. Please, fix them."
	end
	
	unless link.empty?
		msg << " See also: <a href=\"#{link}\">#{link}</a>"
	end
	
	message(msg)
end

# Handle `mvn checkstyle:check` results
#
# Example:
# <file name="/home/coder/mystamps/src/main/java/ru/mystamps/web/controller/CategoryController.java">
#   <error line="64" severity="warning" message="Line is longer than 100 characters (found 131)." source="com.puppycrawl.tools.checkstyle.checks.sizes.LineLengthCheck"/>
# </file>
#
cs_report = 'target/checkstyle-result.xml'
if File.file?(cs_report)
	errors_count = 0
	doc = Nokogiri::XML(File.open(cs_report))
	doc.xpath('//error').each do |node|
		errors_count += 1
		line = node['line']
		if line.to_i > 0
			line = '#L' + line
		else
			line = ''
		end
		msg  = node['message'].sub(/\.$/, '')
		file = node.parent['name'].sub(pwd, '')
		file = github.html_link("#{file}#{line}")
		fail("maven-checkstyle-plugin error in #{file}:\n#{msg}")
	end
	print_errors_summary 'maven-checkstyle-plugin', errors_count, 'https://github.com/php-coder/mystamps/wiki/checkstyle'
end

# Handle `mvn pmd:check` results
#
# Example:
# <file name="/home/coder/mystamps/src/main/java/ru/mystamps/web/dao/impl/JdbcSeriesDao.java">
#   <violation beginline="46" endline="361" begincolumn="49" endcolumn="1" rule="TooManyMethods" ruleset="Code Size" package="ru.mystamps.web.dao.impl" class="JdbcSeriesDao" externalInfoUrl="https://pmd.github.io/pmd-5.5.2/pmd-java/rules/java/codesize.html#TooManyMethods" priority="3">
#     This class has too many methods, consider refactoring it.
#   </violation>
# </file>
#
pmd_report = 'target/pmd.xml'
if File.file?(pmd_report)
	errors_count = 0
	doc = Nokogiri::XML(File.open(pmd_report))
	doc.xpath('//violation').each do |node|
		errors_count += 1
		from_line = node['beginline']
		to_line = node['endline']
		line = "#L#{from_line}"
		if to_line.to_i > from_line.to_i
			line << '-L' << to_line
		end
		msg  = node.text.lstrip.sub(/\.$/, '')
		file = node.parent['name'].sub(pwd, '')
		file = github.html_link("#{file}#{line}")
		fail("maven-pmd-plugin error in #{file}:\n#{msg}")
	end
	print_errors_summary 'maven-pmd-plugin', errors_count, 'https://github.com/php-coder/mystamps/wiki/pmd-cpd'
end

# Handle `mvn codenarc:codenarc` results
#
# Example:
# <CodeNarc url="http://www.codenarc.org" version="0.25.2">
#   <Project title="&quot;My Stamps&quot;">
#     <SourceDirectory>/home/coder/mystamps/src/test/groovy</SourceDirectory>
#   </Project>
#   <Package path="ru/mystamps/web/service" totalFiles="14" filesWithViolations="2" priority1="0" priority2="0" priority3="4">
#     <File name="CollectionServiceImplTest.groovy">
#       <Violation ruleName="UnnecessaryGString" priority="3" lineNumber="99">
#         <SourceLine><![CDATA[service.createCollection(123, "any-login")]]></SourceLine>
#         <Message><![CDATA[The String 'any-login' can be wrapped in single quotes instead of double quotes]]></Message>
#       </Violation>
#     </File>
#   </Package>
# </CodeNarc>
#
codenarc_report = 'target/CodeNarc.xml'
if File.file?(codenarc_report)
	errors_count = 0
	doc = Nokogiri::XML(File.open(codenarc_report))
	root_dir = doc.xpath('//SourceDirectory').first.text.sub(pwd, '')
	doc.xpath('//Violation').each do |node|
		errors_count += 1
		path = node.parent.parent['path']
		line = node['lineNumber']
		msgNode = node.xpath('./Message').first
		if msgNode != nil
			msg  = msgNode.text
		else
			# in rare cases, a message maybe abent and we use a rule name instead
			msg = node['ruleName']
		end
		file = node.parent['name']
		file = github.html_link("#{root_dir}/#{path}/#{file}#L#{line}")
		fail("codenarc-maven-plugin error in #{file}:\n#{msg}")
	end
	print_errors_summary 'codenarc-maven-plugin', errors_count, 'https://github.com/php-coder/mystamps/wiki/codenarc'
end

# Handle `mvn license:check` output
#
# Example:
# [INFO] --- license-maven-plugin:3.0:check (default-cli) @ mystamps ---
# [INFO] Checking licenses...
# [WARNING] Missing header in: /home/coder/mystamps/src/main/java/ru/mystamps/web/Db.java
# [INFO] ------------------------------------------------------------------------
# [INFO] BUILD FAILURE
# [INFO] ------------------------------------------------------------------------
#
license_output = 'license.log'
if File.file?(license_output)
	errors = []
	File.readlines(license_output)
		.select { |line| line.start_with? '[WARNING]' }
		.each do |line|
			line.sub!('[WARNING] ', '')
			line.sub!(pwd, '')
			if line =~ /Missing header in: .*/
				parsed = line.match(/(?<msg>Missing header in: )(?<file>.*)/)
				msg    = parsed['msg']
				file   = parsed['file']
				file   = github.html_link("#{file}#L1")
				line = "#{msg}#{file}"
			end
			errors << line
		end
	
	unless errors.empty?
		link = 'https://github.com/php-coder/mystamps/wiki/check-license-header'
		errors_cnt = errors.size()
		error_msgs = errors.join("</li>\n<li>")
		if errors_cnt == 1
			fail("license-maven-plugin reported about #{errors_cnt} error:\n"\
				"<ul><li>#{error_msgs}</li></ul>\n"\
				"Please, fix it by executing `mvn license:format`\n"\
				"See also: <a href=\"#{link}\">#{link}</a>")
		elsif errors_cnt > 1
			fail("license-maven-plugin reported about #{errors_cnt} errors:\n"\
				"<ul><li>#{error_msgs}</li></ul>\n"\
				"Please, fix them by executing `mvn license:format`\n"\
				"See also: <a href=\"#{link}\">#{link}</a>")
		end
		print_errors_summary 'license-maven-plugin', 1
	end
end

# Handle `mvn sortpom:verify` output
#
# Example:
# [INFO] --- sortpom-maven-plugin:2.5.0:verify (default-cli) @ mystamps ---
# [INFO] Verifying file /home/coder/mystamps/pom.xml
# [ERROR] The xml element <groupId>com.github.heneke.thymeleaf</groupId> should be placed before <groupId>javax.validation</groupId>
# [ERROR] The file /home/coder/mystamps/pom.xml is not sorted
# [INFO] ------------------------------------------------------------------------
# [INFO] BUILD FAILURE
# [INFO] ------------------------------------------------------------------------
#
sortpom_output = 'pom.log'
if File.file?(sortpom_output)
	errors = []
	File.readlines(sortpom_output).each do |line|
		# don't process lines after this message
		if line.start_with? '[INFO] BUILD FAILURE'
			break
		end
		
		# ignore non-error messages
		unless line.start_with? '[ERROR]'
			next
		end
		
		line.sub!('[ERROR] ', '')
		errors << line.rstrip
	end
	
	unless errors.empty?
		link = 'https://github.com/php-coder/mystamps/wiki/sortpom'
		errors_cnt = errors.size()
		error_msgs = errors.map { |msg| msg.sub(pwd, '') }.join("</li>\n<li>")
		if errors_cnt == 1
			fail("sortpom-maven-plugin reported about #{errors_cnt} error:\n"\
				"<ul><li>#{error_msgs}</li></ul>\n"\
				"Please, fix it by executing `mvn sortpom:sort`\n"\
				"See also: <a href=\"#{link}\">#{link}</a>")
		elsif errors_cnt > 1
			fail("sortpom-maven-plugin reported about #{errors_cnt} errors:\n"\
				"<ul><li>#{error_msgs}</li></ul>\n"\
				"Please, fix them by executing `mvn sortpom:sort`\n"\
				"See also: <a href=\"#{link}\">#{link}</a>")
		end
		print_errors_summary 'sortpom-maven-plugin', 1
	end
end

# Handle `bootlint` output
#
# Example:
# src/main/webapp/WEB-INF/views/series/info.html:123:12 E013 Only columns (`.col-*-*`) may be children of `.row`s
# src/main/webapp/WEB-INF/views/site/events.html:197:7 E013 Only columns (`.col-*-*`) may be children of `.row`s
#
# For details, look up the lint problem IDs in the Bootlint wiki:
# https://github.com/twbs/bootlint/wiki
# 3 lint error(s) found across 20 file(s).
#
bootlint_output = 'bootlint.log'
if File.file?(bootlint_output)
	errors_count = 0
	File.readlines(bootlint_output).each do |line|
		if line !~ /:\d+:\d+/
			next
		end
		
		errors_count += 1
		
		parsed = line.match(/^(?<file>[^:]+):(?<line>\d+):\d+ (?<code>[^ ]+) (?<msg>.*)/)
		msg    = parsed['msg']
		lineno = parsed['line']
		file   = parsed['file']
		code   = parsed['code']
		file   = github.html_link("#{file}#L#{lineno}")
		fail("bootlint error in #{file}:\n[#{code}](https://github.com/twbs/bootlint/wiki/#{code}): #{msg}")
	end
	# FIXME: add link to wiki page (#316)
	print_errors_summary 'bootlint', errors_count
end

# Handle `rflint` output
#
# Example:
# + src/test/robotframework/series/creation/logic.robot
# E: 35, 0: Too many steps (34) in test case (TooManyTestSteps)
#
rflint_output = 'rflint.log'
if File.file?(rflint_output)
	errors_count = 0
	current_file = ''
	File.readlines(rflint_output).each do |line|
		if line.start_with? '+ '
			current_file = line.sub(/^\+ /, '').rstrip
			next
		end
		
		errors_count += 1
		
		parsed = line.match(/[A-Z]: (?<line>\d+), [^:]+: (?<msg>.*)/)
		msg    = parsed['msg'].sub(/ \(\w+\)$/, '')
		lineno = parsed['line']
		file   = github.html_link("#{current_file}#L#{lineno}")
		fail("rflint error in #{file}:\n#{msg}")
	end
	print_errors_summary 'rflint', errors_count, 'https://github.com/php-coder/mystamps/wiki/rflint'
end

# Handle shellcheck output
#
# Example:
# src/main/scripts/ci/deploy.sh:29:24: note: Double quote to prevent globbing and word splitting. [SC2086]
# src/main/scripts/ci/common.sh:28:2: note: egrep is non-standard and deprecated. Use grep -E instead. [SC2196]
#
shellcheck_output = 'shellcheck.log'
if File.file?(shellcheck_output)
	errors_count = 0
	File.readlines(shellcheck_output).each do |line|
		errors_count += 1
		
		parsed = line.match(/^(?<file>[^:]+):(?<line>\d+):\d+:[^:]+: (?<msg>.+)/)
		file   = parsed['file']
		lineno = parsed['line']
		msg    = parsed['msg']
		msg, _, code = msg.rpartition('[')
		msg    = msg.rstrip.sub(/\.$/, '')
		code   = code.sub(/\]$/, '')
		file   = github.html_link("#{file}#L#{lineno}")
		fail("shellcheck error in #{file}:\n[#{code}](https://github.com/koalaman/shellcheck/wiki/#{code}): #{msg}")
	end
	# FIXME: add link to wiki page
	print_errors_summary 'shellcheck', errors_count
end

# Handle `mvn enforcer:enforce` results
#
# Example:
# [INFO] --- maven-enforcer-plugin:1.4.1:enforce (default-cli) @ mystamps ---
# [WARNING] Rule 0: org.apache.maven.plugins.enforcer.BannedDependencies failed with message:
# Found Banned Dependency: junit:junit:jar:4.12
# Use 'mvn dependency:tree' to locate the source of the banned dependencies.
# [INFO] ------------------------------------------------------------------------
# [INFO] BUILD FAILURE
# [INFO] ------------------------------------------------------------------------
#
enforcer_output = 'enforcer.log'
if File.file?(enforcer_output)
	errors = []
	plugin_output_started = false
	File.readlines(enforcer_output).each do |line|
		# We're interesting in everything between
		#     [INFO] --- maven-enforcer-plugin:1.4.1:enforce (default-cli) @ mystamps ---
		# and
		#     [INFO] ------------------------------------------------------------------------
		# lines
		
		if line.start_with? '[INFO] --- maven-enforcer-plugin:'
			plugin_output_started = true
			next
		end
		
		unless plugin_output_started
			next
		end
		
		if line.start_with? '[INFO] -----'
			break
		end
		
		if line.start_with? '[INFO] Download'
			next
		end
		
		line.sub!('[WARNING] ', '')
		errors << line.rstrip
	end
	
	unless errors.empty?
		error_msgs = errors.join("\n")
		fail("maven-enforcer-plugin reported about errors. Please, fix them. "\
			"Here is its output:\n```\n#{error_msgs}\n```")
		print_errors_summary 'maven-enforcer-plugin', 1
	end
end

# Handle `mvn jasmine:test` report
#
# Example:
# <testsuite errors="0" name="jasmine.specs" tests="22" failures="3" skipped="0" hostname="localhost" time="0.0" timestamp="2017-03-09T19:52:06">
#   <testcase classname="jasmine" name="CatalogUtils.expandNumbers() should return string without hyphen as it" time="0.0" failure="true">
#     <error type="expect.toEqual" message="Expected 'test' to equal '2test'.">Expected 'test' to equal '2test'.</error>
#   </testcase>
# </testsuite>
#
jasmine_report = 'target/jasmine/TEST-jasmine.xml'
if File.file?(jasmine_report)
	doc = Nokogiri::XML(File.open(jasmine_report))
	testsuite = doc.xpath('/testsuite').first
	failures  = testsuite['failures'].to_i
	if failures > 0
		testsuite.xpath('.//testcase[@failure="true"]').each do |tc|
			# NOTE: unfortunately jasmine report doesn't contain file name
			msg = tc.xpath('./error').first.text.sub(/\.$/, '')
			testcase = tc['name']
			fail("jasmine-maven-plugin error:\nTest case `#{testcase}` fails with message:\n`#{msg}`\n")
		end
		
		print_errors_summary 'jasmine-maven-plugin', failures, 'https://github.com/php-coder/mystamps/wiki/unit-tests-js'
	end
end

# Handle `html5validator` output
#
# Example:
# WARNING:html5validator.validator:"file:/home/coder/mystamps/src/main/webapp/WEB-INF/views/series/info.html":110.11-114.58: error: very long err msg.
# "file:/home/coder/mystamps/src/main/webapp/WEB-INF/views/series/info.html":438.16-438.35: error: very long err msg.
#
validator_output = 'validator.log'
if File.file?(validator_output)
	errors_count = 0
	File.readlines(validator_output).each do |line|
		errors_count += 1
		line.sub!(/^WARNING:html5validator.validator:/, '')
		
		parsed = line.match(/^"file:(?<file>[^"]+)":(?<line>\d+)[^:]+: (error|info warning): (?<msg>.+)/)
		msg    = parsed['msg'].sub(/\.$/, '')
		file   = parsed['file'].sub(pwd, '')
		lineno = parsed['line']
		file   = github.html_link("#{file}#L#{lineno}")
		
		fail("html5validator error in #{file}:\n#{msg}")
	end
	
	# FIXME: add link to wiki page (#541)
	print_errors_summary 'html5validator', errors_count
end

# @todo #1060 Danger: handle Babel errors from frontend-maven-plugin

# Handle `mvn org.apache.maven.plugins:maven-compiler-plugin:compile` output
# Handle `mvn org.apache.maven.plugins:maven-compiler-plugin:testCompile` output
# Handle `mvn org.codehaus.gmavenplus:gmavenplus-plugin:testCompile` output
#
# Example for maven-compiler-plugin:
# [INFO] --- maven-compiler-plugin:3.6.1:compile (default-compile) @ mystamps ---
# [INFO] Changes detected - recompiling the module!
# [INFO] Compiling 206 source files to /home/coder/mystamps/target/classes
# [INFO] -------------------------------------------------------------
# [ERROR] COMPILATION ERROR :
# [INFO] -------------------------------------------------------------
# [ERROR] /home/coder/mystamps/src/main/java/ru/mystamps/web/service/CollectionService.java:[31,32] cannot find symbol
#   symbol:   class Date
#   location: interface ru.mystamps.web.service.CollectionService
# [INFO] 1 error
# [INFO] -------------------------------------------------------------
# [INFO] ------------------------------------------------------------------------
# [INFO] BUILD FAILURE
# [INFO] ------------------------------------------------------------------------
#
# Example for gmavenplus-plugin:testCompile:
# [INFO] --- gmavenplus-plugin:1.5:testCompile (default) @ mystamps ---
# [INFO] Using Groovy 2.0.8 to perform testCompile.
# [INFO] ------------------------------------------------------------------------
# [INFO] BUILD FAILURE
# [INFO] ------------------------------------------------------------------------
# [INFO] Total time: 2.006 s
# [INFO] Finished at: 2017-03-01T22:25:47+01:00
# [INFO] Final Memory: 24M/322M
# [INFO] ------------------------------------------------------------------------
# [ERROR] Failed to execute goal org.codehaus.gmavenplus:gmavenplus-plugin:1.5:testCompile (default) on project mystamps: Error occurred while calling a method on a Groovy class from classpath. InvocationTargetException: startup failed:
# [ERROR] /home/coder/mystamps/src/test/groovy/ru/mystamps/web/service/SiteServiceImplTest.groovy: 27: unable to resolve class Specification
# [ERROR] @ line 27, column 1.
# [ERROR] @SuppressWarnings(['ClassJavadoc', 'MethodName', 'NoDef', 'NoTabCharacter', 'TrailingWhitespace'])
# [ERROR] ^
# [ERROR]
# [ERROR] 1 error
# [ERROR] -> [Help 1]
# [ERROR]
# [ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
# [ERROR] Re-run Maven using the -X switch to enable full debug logging.
#
# We're parsing file with `mvn test` output because compilation occurs before executing tests.
# Also because goals are executing in order and the process stops if one of
# them failed, we're using the same array to collect errors from different goals.
test_output = 'test.log'
if File.file?(test_output)
	errors = []
	plugin_output_started = false
	errors_detected = false
	plugin = 'unknown'
	File.readlines(test_output).each do |line|
		# For maven-compiler-plugin we're interesting in everything between
		#     [INFO] --- maven-compiler-plugin:3.6.1:compile (default-compile) @ mystamps ---
		# and
		#     [INFO] --- native2ascii-maven-plugin:1.0-beta-1:native2ascii (default) @ mystamps ---
		# or
		#     [INFO] BUILD FAILURE
		if line.start_with? '[INFO] --- maven-compiler-plugin:'
			plugin = 'maven-compiler-plugin'
			plugin_output_started = true
			errors << line.rstrip
			next
		end
		
		# For maven-compiler-plugin we're interesting in everything between
		#     [ERROR] Failed to execute goal org.codehaus.gmavenplus:gmavenplus-plugin:1.5:testCompile (default) on project mystamps:
		# and
		#     [ERROR] -> [Help 1]
		if line.start_with? '[ERROR] Failed to execute goal org.codehaus.gmavenplus:'
			plugin = 'gmavenplus-plugin'
			plugin_output_started = true
			errors << line.rstrip
			next
		end
		
		unless plugin_output_started
			next
		end
		
		if line.start_with? '[INFO] Download'
			next
		end
		
		# next plugin started its execution =>
		# no errors encountered, continue to find next compiler plugin invocation
		if line.start_with? '[INFO] --- '
			plugin_output_started = false
			errors.clear()
			next
		end
		
		if line =~ /BUILD FAILURE/
			if errors.empty?
				# when gmavenplus plugin fails we need to collect errors after this message
				next
			else
				# build failed => error output is collected, stop processing
				break
			end
		end
		
		# stop collecting error message for the gmavenplus-plugin
		if line.start_with? '[ERROR] -> [Help'
			break
		end
		
		errors << line.rstrip
	end
	
	unless errors.empty?
		if errors.last.start_with? '[INFO] -----'
			errors.pop # remove last useless line
		end
		error_msgs = errors.join("\n")
		fail("#{plugin} has failed. Please, fix compilation errors. "\
			"Here is its output:\n```\n#{error_msgs}\n```")
	end
end

# Handle `mvn test` reports
# maven-surefire-plugin generates multiple XML files (one result file per test class).
#
# Example:
# <testsuite name="ru.mystamps.web.feature.site.CronServiceImplTest" time="0.175" tests="7" errors="0" skipped="0" failures="2">
#   <testcase name="sendDailyStatistics() should prepare report and pass it to mail service" classname="ru.mystamps.web.feature.site.CronServiceImplTest" time="0.107">
#     <failure message="Condition not satisfied: bla bla bla" type="org.spockframework.runtime.SpockComparisonFailure">
#       org.spockframework.runtime.SpockComparisonFailure: bla bla bla
#     </failure>
#   </testcase>
# </testsuite>
#
test_reports_pattern = 'target/surefire-reports/TEST-*.xml'
test_reports = Dir.glob(test_reports_pattern)
unless test_reports.empty?
	errors_count = 0
	test_reports.each do |file|
		doc = Nokogiri::XML(File.open(file))
		testsuite = doc.xpath('/testsuite').first
		failures  = testsuite['failures'].to_i
		if failures == 0
			next
		end
		
		testsuite.xpath('.//failure').each do |failure|
			errors_count += 1
			msg = failure.text
			tc  = failure.parent
			file = tc['classname'].gsub(/\./, '/')
			path = "src/test/groovy/#{file}.groovy"
			if File.file?(path)
				file = path
			end
			# @todo #536 Danger: highlight a failed spock test
			file = github.html_link(file)
			testcase = tc['name']
			fail("maven-surefire-plugin error in #{file}:\nTest case `#{testcase}` fails with message:\n```\n#{msg}\n```")
		end
	end
	print_errors_summary 'maven-surefire-plugin', errors_count, 'https://github.com/php-coder/mystamps/wiki/unit-tests'
end

# Handle `mvn spotbugs:check` results
#
# Example:
# <BugCollection sequence="0" release="" analysisTimestamp="1489272156067" version="3.0.1" # timestamp="1489272147000">
#   <Project projectName="My Stamps">
#     <SrcDir>/home/coder/mystamps/src/main/java</SrcDir>
#   </Project>
#   <BugInstance instanceOccurrenceNum="0" instanceHash="70aca951e7fd81233fcdb6d19dc38a90" rank="17" abbrev="Eq" category="STYLE" priority="2" type="EQ_DOESNT_OVERRIDE_EQUALS" instanceOccurrenceMax="0">
#     <LongMessage>ru.mystamps.web.support.spring.security.CustomUserDetails doesn't override org.springframework.security.core.userdetails.User.equals(Object)</LongMessage>
#     <Class classname="ru.mystamps.web.support.spring.security.CustomUserDetails" primary="true">
#       <SourceLine classname="ru.mystamps.web.support.spring.security.CustomUserDetails" start="31" end="45" sourcepath="ru/mystamps/web/support/spring/security/CustomUserDetails.java" sourcefile="CustomUserDetails.java">
#       </SourceLine>
#     </Class>
#   </BugInstance>
# </BugCollection>
#
spotbugs_report = 'target/spotbugsXml.xml'
if File.file?(spotbugs_report)
	errors_count = 0
	doc = Nokogiri::XML(File.open(spotbugs_report))
	src_dirs = doc.xpath('//SrcDir').map { |node| node.text }
	doc.xpath('//BugInstance').each do |node|
		errors_count += 1
		src  = node.xpath('./Class/SourceLine').first
		from_line = src['start']
		to_line = src['end']
		line = "#L#{from_line}"
		if to_line.to_i > from_line.to_i
			line << '-L' << to_line
		end
		msg  = node.xpath('./LongMessage').first.text
		file = src['sourcepath']
		src_dir = src_dirs.find { |dir| File.file?("#{dir}/#{file}") }
		src_dir = src_dir.sub(pwd, '')
		file = github.html_link("#{src_dir}/#{file}#{line}")
		fail("spotbugs-maven-plugin error in #{file}:\n#{msg}")
	end
	# FIXME: add a link to the SpotBugs documentation
	print_errors_summary 'spotbugs-maven-plugin', errors_count
end

# Handle `mvn robotframework:run` (`mvn verify`) report
#
# Example:
# <suite source="/home/coder/mystamps/src/test/robotframework/category/access.robot" name="Access" id="s1-s1-s1">
#   <test name="Create category with name in English and Russian" id="s1-s1-s2-s1-t2">
#     <status critical="yes" endtime="20170301 20:27:07.476" starttime="20170301 20:27:06.810" status="FAIL">
#       The text of element 'id=page-header' should have been 'Space!', but it was 'Space'.
#     </status>
#   </test>
# </suite>
rf_report = 'target/robotframework-reports/output.xml'
if File.file?(rf_report)
	errors_count = 0
	doc = Nokogiri::XML(File.open(rf_report))
	doc.xpath('//status[@critical="yes"][@status="FAIL"]').each do |node|
		errors_count += 1
		# find first parent's <suite> tag
		suite = node.parent
		while suite.name != 'suite'
			suite = suite.parent
		end
		msg  = node.text.sub(/\.$/, '')
		msg  = msg.split(/\n/).delete_if {|el| el =~ /^(Build|System|Driver) info:/}.join("\n")
		scenario_file = suite['source']
		file = scenario_file.sub(pwd, '')
		testcase = node.parent['name']
		
		# locate the lines of a test case in a test suite
		from_line = -1
		to_line = -1
		current_line = 0
		File.readlines(scenario_file).each do |line|
			current_line += 1
			line.rstrip!
			
			if line == testcase
				from_line = current_line
				next
			end
			
			if from_line > 0 && line == ''
				to_line = current_line - 1
				break
			end
		end
		
		line = ''
		if from_line > 0 && to_line > 0
			line = "#L#{from_line}-L#{to_line}"
		end
		file = github.html_link("#{file}#{line}")
		fail("robotframework-maven-plugin error in #{file}:\nTest case `#{testcase}` fails with message:\n#{msg}")
	end
	print_errors_summary 'robotframework-maven-plugin', errors_count, 'https://github.com/php-coder/mystamps/wiki/integration-tests'
end

if github.pr_body !~ /Addressed to #\d+/
	warn(
		"danger check: pull request **description** doesn't contain a link to original issue.\n"\
		"Consider adding a comment in the following format: `Addressed to #XXX` where `XXX` is an issue number"
	)
end

commits = git.commits.size
if commits > 1
	if git.commits.any? { |c| c.message =~ /^Merge branch/ || c.message =~ /^Merge remote-tracking branch/ }
		fail(
			"danger check: pull request contains merge commits! "\
			"Please, rebase your branch to get rid of them: "\
			"`git rebase master #{github.branch_for_head}` and `git push --force-with-lease`"
		)
	else
		warn(
			"danger check: pull request contains #{commits} commits while most of the cases it should have only one. "\
			"If it's not a special case you should [**squash the commits**](https://davidwalsh.name/squash-commits-git) into single one.\n"\
			"But be careful because **it can destroy** all your changes!"
		)
	end
end

if github.branch_for_head !~ /^gh[0-9]+_/
	warn("danger check: branch `#{github.branch_for_head}` does not comply with our best practices. "\
		"Branch name should use the following scheme: `ghXXX_meaningful-name` where `XXX` is an issue number. "\
		"**Next time**, please, use this scheme :)"
	)
end

js_file  = %r{^src/main/javascript/.*\.js$}
component_file  = %r{^src/main/frontend/src/.*\.js$}
css_file = %r{^src/main/webapp/.*\.css$}
modified_resources = git.modified_files.any? { |file| file =~ js_file || file =~ component_file || file =~ css_file }
updated_url = git.modified_files.include? 'src/main/java/ru/mystamps/web/feature/site/ResourceUrl.java'
if modified_resources && !updated_url
	warn("danger check: looks like you forgot to update `ResourceUrl.RESOURCES_VERSION` after modifying JS/CSS file(s)")
end

all_checks_passed = violation_report[:errors].empty? && violation_report[:warnings].empty? && violation_report[:messages].empty?
if all_checks_passed
	message(
		"@#{github.pr_author} thank you for the PR! All quality checks have been passed! "\
		"Next step is to wait when @php-coder will review this code"
	)
end
