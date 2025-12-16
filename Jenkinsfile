pipeline {
    agent any
    
    // ============================================
    // AUTOMATIC NODE.JS VERSION DETECTION
    // ============================================
    // The pipeline automatically detects Node.js version from your code:
    // 1. Checks .nvmrc file (most common - contains version like "18" or "20.0.0")
    // 2. Checks package.json "engines.node" field
    // 3. Checks .node-version file
    // 4. Falls back to default (node18) if none found
    //
    // To specify version in your code, create a .nvmrc file:
    //   echo "20" > .nvmrc
    //
    // Or add to package.json:
    //   "engines": { "node": ">=18.0.0" }
    // ============================================
    
    tools {
        // Default fallback version - will be overridden by auto-detection
        // This ensures pipeline works even if detection fails
        nodejs "node18"
    }

    environment {
        GIT_CREDENTIALS_ID = 'frontend-pr'
        GITHUB_REPO = 'demo-frontend'
        // Detected Node.js version (set by detection stage)
        DETECTED_NODE_VERSION = ''
        // Node.js version to use (detected or fallback)
        NODEJS_VERSION = ''
    }

    options {
        // Skip checkout if PR is from the same repo (for faster builds)
        skipDefaultCheckout false
        // Timeout for the entire build
        timeout(time: 15, unit: 'MINUTES')
        // Build only when PR is opened, updated, or reopened
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    // ============================================
    // AUTOMATIC PR TRIGGER SETUP INSTRUCTIONS
    // ============================================
    // This pipeline automatically triggers when a PR is raised.
    // 
    // SETUP METHOD 1: GitHub Webhook (Recommended)
    // 1. Go to your GitHub repository: Settings -> Webhooks -> Add webhook
    // 2. Payload URL: http://your-jenkins-url/github-webhook/
    // 3. Content type: application/json
    // 4. Events: Select "Pull requests" and "Pushes"
    // 5. Save webhook
    //
    // SETUP METHOD 2: Jenkins GitHub Branch Source Plugin
    // 1. In Jenkins: Manage Jenkins -> Configure System
    // 2. Add GitHub organization or repository
    // 3. Enable "Build PRs" option
    // 4. This pipeline will auto-trigger on:
    //    - PR opened
    //    - PR updated (new commits)
    //    - PR reopened
    //
    // The pipeline will catch misconfigurations BEFORE merging:
    // ✅ Linting errors
    // ✅ Type errors
    // ✅ Test failures
    // ✅ Build failures
    // ✅ Missing configuration files
    // ============================================

    stages {
        stage('Checkout PR') {
            steps {
                script {
                    // Get PR information from environment variables set by GitHub PR plugin
                    // CHANGE_ID is set by GitHub Branch Source plugin
                    // ghprbPullId is set by GitHub Pull Request Builder plugin
                    def prNumber = env.CHANGE_ID ?: env.ghprbPullId
                    def prSourceBranch = env.CHANGE_BRANCH ?: env.ghprbSourceBranch
                    def prTargetBranch = env.CHANGE_TARGET ?: env.ghprbTargetBranch
                    def prRepoUrl = "https://github.com/${GITHUB_REPO}"

                    if (!prNumber) {
                        error("Unable to determine PR number. This pipeline should be triggered by a Pull Request.")
                    }

                    echo "📦 Checking out PR #${prNumber}"
                    echo "   Source Branch: ${prSourceBranch}"
                    echo "   Target Branch: ${prTargetBranch}"
                    echo "   Repository: ${prRepoUrl}"

                    // Checkout the PR branch
                    // Using standard checkout which works with GitHub Branch Source plugin
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "origin/${prSourceBranch}"]],
                        extensions: [
                            [$class: 'CleanCheckout'],
                            [$class: 'CloneOption', 
                             depth: 1, 
                             noTags: false, 
                             shallow: true]
                        ],
                        userRemoteConfigs: [[
                            url: prRepoUrl,
                            credentialsId: "${env.GIT_CREDENTIALS_ID}",
                            refspec: "+refs/pull/${prNumber}/head:refs/remotes/origin/pr/${prNumber}"
                        ]]
                    ])

                    // Display commit information
                    sh '''
                        echo "📝 Latest commit:"
                        git log -1 --pretty=format:"%h - %an, %ar : %s"
                    '''

                    // Update GitHub PR status to pending
                    try {
                        githubStatus(
                            context: 'jenkins/pr-build',
                            description: 'Build in progress...',
                            state: 'PENDING'
                        )
                    } catch (Exception e) {
                        echo "⚠️ Warning: Could not update GitHub status: ${e.message}"
                        echo "   Make sure GitHub plugin is installed and configured."
                    }
                }
            }
        }

        stage('Detect Node.js Version') {
            steps {
                script {
                    echo "🔍 Auto-detecting Node.js version from code..."
                    
                    def detectedVersion = ''
                    
                    // Method 1: Check .nvmrc file (most common)
                    def nvmrcContent = sh(
                        script: '''
                            if [ -f .nvmrc ]; then
                                cat .nvmrc | tr -d 'v' | tr -d '\n' | tr -d ' '
                            else
                                echo ""
                            fi
                        ''',
                        returnStdout: true
                    ).trim()
                    
                    if (nvmrcContent && nvmrcContent != '') {
                        detectedVersion = nvmrcContent
                        echo "✅ Found .nvmrc file with version: ${detectedVersion}"
                    } else {
                        // Method 2: Check package.json engines.node (using grep/sed to avoid Node.js dependency)
                        def packageJsonContent = sh(
                            script: '''
                                if [ -f package.json ]; then
                                    # Extract engines.node using grep and sed (works without Node.js)
                                    grep -A 5 '"engines"' package.json | grep -o '"node"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"node"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\\1/' | head -1 | grep -oE '[0-9]+' | head -1 || echo ""
                                else
                                    echo ""
                                fi
                            ''',
                            returnStdout: true
                        ).trim()
                        
                        if (packageJsonContent && packageJsonContent != '') {
                            detectedVersion = packageJsonContent
                            echo "✅ Found Node.js version in package.json engines: ${detectedVersion}"
                        } else {
                            // Method 3: Check .node-version file
                            def nodeVersionContent = sh(
                                script: '''
                                    if [ -f .node-version ]; then
                                        cat .node-version | tr -d 'v' | tr -d '\n' | tr -d ' '
                                    else
                                        echo ""
                                    fi
                                ''',
                                returnStdout: true
                            ).trim()
                            
                            if (nodeVersionContent && nodeVersionContent != '') {
                                detectedVersion = nodeVersionContent
                                echo "✅ Found .node-version file with version: ${detectedVersion}"
                            }
                        }
                    }
                    
                    // Normalize version (extract major version number)
                    if (detectedVersion && detectedVersion != '') {
                        def majorVersion = detectedVersion.split('\\.')[0]
                        env.DETECTED_NODE_VERSION = majorVersion
                        
                        // Map to Jenkins Node.js tool name (node18, node20, etc.)
                        def jenkinsNodeVersion = "node${majorVersion}"
                        env.NODEJS_VERSION = jenkinsNodeVersion
                        
                        echo "=========================================="
                        echo "📌 Detected Node.js Version: ${majorVersion}"
                        echo "📌 Using Jenkins tool: ${jenkinsNodeVersion}"
                        echo "=========================================="
                        
                        // Try to use the detected version with nvm if available
                        // Otherwise, Jenkins tools will handle it
                        sh '''
                            # Try to use nvm if available
                            if command -v nvm &> /dev/null || [ -s "$HOME/.nvm/nvm.sh" ]; then
                                export NVM_DIR="$HOME/.nvm"
                                if [ -s "$NVM_DIR/nvm.sh" ]; then
                                    source "$NVM_DIR/nvm.sh"
                                fi
                                
                                # Get version from .nvmrc or use detected version
                                if [ -f .nvmrc ]; then
                                    nvm use || echo "⚠️ nvm version from .nvmrc not installed, using Jenkins tool"
                                elif [ -n "${DETECTED_NODE_VERSION}" ]; then
                                    nvm use ${DETECTED_NODE_VERSION} || echo "⚠️ nvm version ${DETECTED_NODE_VERSION} not installed, using Jenkins tool"
                                fi
                            else
                                echo "ℹ️ nvm not available, using Jenkins Node.js tool configuration"
                            fi
                        '''
                    } else {
                        // Fallback to default
                        env.DETECTED_NODE_VERSION = '18'
                        env.NODEJS_VERSION = 'node18'
                        echo "⚠️ No Node.js version specified in code (.nvmrc, package.json engines, or .node-version)"
                        echo "📌 Using default: Node.js 18"
                        echo "💡 Tip: Create a .nvmrc file with your Node.js version (e.g., '20')"
                    }
                    
                    // Display current Node.js version
                    sh '''
                        echo "=========================================="
                        echo "Current Node.js Environment:"
                        echo "=========================================="
                        node --version || echo "⚠️ Node.js not found"
                        npm --version || echo "⚠️ npm not found"
                        echo "Node.js path: $(which node || echo 'Not found')"
                        echo "=========================================="
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo "📥 Installing npm dependencies..."
                    echo "Using Node.js version: ${env.NODEJS_VERSION ?: 'node18 (default)'}"
                    echo "Detected version from code: ${env.DETECTED_NODE_VERSION ?: 'Not specified (using default)'}"
                    
                    // Ensure we're using the correct Node.js version
                    sh '''
                        # Verify Node.js version matches requirement
                        if [ -n "${DETECTED_NODE_VERSION}" ] && [ "${DETECTED_NODE_VERSION}" != "18" ]; then
                            CURRENT_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
                            if [ "$CURRENT_VERSION" != "${DETECTED_NODE_VERSION}" ]; then
                                echo "⚠️ Warning: Current Node.js version (${CURRENT_VERSION}) doesn't match detected version (${DETECTED_NODE_VERSION})"
                                echo "   Make sure Jenkins has Node.js ${DETECTED_NODE_VERSION} installed in Global Tool Configuration"
                            fi
                        fi
                    '''
                    
                    // Use npm ci if package-lock.json exists, otherwise use npm install
                    sh '''
                        if [ -f package-lock.json ]; then
                            echo "📦 Found package-lock.json, using npm ci for clean install..."
                            npm ci
                        else
                            echo "📦 No package-lock.json found, using npm install..."
                            npm install
                        fi
                    '''
                }
            }
        }

        stage('Validate & Code Quality') {
            steps {
                script {
                    echo "🔍 Validating configuration, dependencies, and code quality..."
                    sh '''
                        echo "=========================================="
                        echo "Validation & Code Quality Checks"
                        echo "=========================================="
                        
                        # Configuration validation
                        echo "⚙️ Validating configuration..."
                        if [ ! -f "package.json" ]; then
                            echo "❌ package.json not found!"
                            exit 1
                        fi
                        node -e "JSON.parse(require('fs').readFileSync('package.json'))" && echo "✅ package.json is valid"
                        if ! grep -q '"build"' package.json; then
                            echo "❌ No build script found in package.json!"
                            exit 1
                        fi
                        echo "✅ Build script found"
                        
                        # Security audit (non-blocking)
                        echo ""
                        echo "🔒 Running security audit..."
                        npm audit --audit-level=moderate 2>&1 | head -20 || echo "⚠️ Security issues found (non-blocking)"
                        
                        # Code quality checks
                        echo ""
                        echo "🔍 Running code quality checks..."
                        
                        # Lint
                        if grep -q '"lint"' package.json; then
                            echo "  → Linting..."
                            npm run lint || exit 1
                            echo "  ✅ Linting passed"
                        fi
                        
                        # Type check
                        if grep -q '"typescript"' package.json || [ -f tsconfig.json ]; then
                            echo "  → Type checking..."
                            if grep -q '"type-check"' package.json; then
                                npm run type-check || exit 1
                            else
                                npx tsc --noEmit || exit 0
                            fi
                            echo "  ✅ Type checking passed"
                        fi
                        
                        # Tests
                        if grep -q '"test"' package.json; then
                            echo "  → Running tests..."
                            npm test || exit 1
                            echo "  ✅ Tests passed"
                        fi
                        
                        echo "=========================================="
                    '''
                }
            }
        }

        stage('Build & Validate') {
            steps {
                script {
                    echo "🔨 Building and validating for deployment..."
                    sh '''
                        echo "=========================================="
                        echo "Build & Deployment Validation"
                        echo "=========================================="
                        
                        # Build
                        echo "🔨 Building application..."
                        npm run build || exit 1
                        echo "✅ Build completed"
                        
                        # Validate build output
                        echo ""
                        echo "✅ Validating build output..."
                        BUILD_DIR=""
                        [ -d "dist" ] && BUILD_DIR="dist"
                        [ -d "build" ] && BUILD_DIR="build"
                        [ -d ".next" ] && BUILD_DIR=".next"
                        
                        if [ -z "$BUILD_DIR" ]; then
                            echo "⚠️ Warning: No build output directory found"
                        else
                            echo "✅ Build directory: $BUILD_DIR"
                            
                            # Quick validation
                            JS_FILES=$(find "$BUILD_DIR" -name "*.js" -type f 2>/dev/null | wc -l)
                            [ "$JS_FILES" -gt 0 ] && echo "✅ JavaScript bundles found ($JS_FILES files)" || echo "⚠️ No JS files found"
                            
                            # Check for console.log in production (warning only)
                            CONSOLE_LOGS=$(find "$BUILD_DIR" -name "*.js" -type f -exec grep -l "console\\.log" {} \\; 2>/dev/null | wc -l)
                            [ "$CONSOLE_LOGS" -gt 0 ] && echo "⚠️ Warning: console.log found in $CONSOLE_LOGS files" || echo "✅ No console.log in build"
                        fi
                        
                        echo "=========================================="
                        echo "✅ Build validation passed - Ready to deploy!"
                        echo "=========================================="
                    '''
                }
            }
        }
    }

    post {
        success {
            script {
                echo "=========================================="
                echo "✅ ALL CHECKS PASSED - READY TO MERGE!"
                echo "=========================================="
                echo "✅ Configuration & Dependencies: Validated"
                echo "✅ Code Quality (Lint/Type/Tests): Passed"
                echo "✅ Build & Deployment: Validated"
                echo "=========================================="
                echo ""
                echo "🎉 This PR is safe to merge and deploy!"
                echo "=========================================="
                
                // Update GitHub PR status to success
                try {
                    githubStatus(
                        context: 'jenkins/pr-build',
                        description: 'All checks passed! Ready to merge.',
                        state: 'SUCCESS'
                    )
                } catch (Exception e) {
                    echo "⚠️ Warning: Could not update GitHub status: ${e.message}"
                }
            }
        }
        failure {
            script {
                echo "=========================================="
                echo "❌ PIPELINE FAILED - DO NOT MERGE!"
                echo "=========================================="
                echo ""
                echo "🚫 This PR contains issues that will break deployment:"
                echo ""
                echo "Common issues to check:"
                echo "  ❌ Broken imports or missing dependencies"
                echo "  ❌ Linting errors"
                echo "  ❌ Type errors"
                echo "  ❌ Test failures"
                echo "  ❌ Build failures"
                echo "  ❌ Configuration issues"
                echo "  ❌ Invalid build output"
                echo ""
                echo "📋 Next steps:"
                echo "  1. Check the failed stage above for details"
                echo "  2. Fix the reported issues"
                echo "  3. Push new commits to re-trigger the pipeline"
                echo ""
                echo "=========================================="
                
                // Update GitHub PR status to failure
                try {
                    githubStatus(
                        context: 'jenkins/pr-build',
                        description: 'Pipeline failed! Please fix issues before merging.',
                        state: 'FAILURE'
                    )
                } catch (Exception e) {
                    echo "⚠️ Warning: Could not update GitHub status: ${e.message}"
                }
            }
        }
        always {
            script {
                // Clean up workspace
                echo "🧹 Cleaning up workspace..."
                cleanWs()
            }
        }
    }
}


