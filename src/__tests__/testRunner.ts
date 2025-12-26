/**
 * Test Runner for Comprehensive Testing Suite
 * Orchestrates all test categories and provides reporting
 */

import { execSync } from 'child_process';
import { performance } from 'perf_hooks';

interface TestSuite {
  name: string;
  pattern: string;
  description: string;
}

interface TestResult {
  suite: string;
  passed: boolean;
  duration: number;
  coverage?: number;
  error?: string;
}

class TestRunner {
  private testSuites: TestSuite[] = [
    {
      name: 'Unit Tests - Authentication Service',
      pattern: 'src/lib/services/__tests__/authService.test.ts',
      description: 'Tests authentication functionality (Requirements 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3)'
    },
    {
      name: 'Unit Tests - Gemini AI Service',
      pattern: 'src/lib/services/__tests__/geminiService.test.ts',
      description: 'Tests AI integration and caching (Requirements 5.1, 5.2, 5.3, 5.4, 10.1, 10.2, 10.3, 10.4)'
    },
    {
      name: 'Performance Tests - Gemini AI',
      pattern: 'src/lib/services/__tests__/geminiService.performance.test.ts',
      description: 'Tests AI response times and caching performance (Requirements 10.1, 10.2, 10.3, 10.4)'
    },
    {
      name: 'Integration Tests - Career Assessment',
      pattern: 'src/components/__tests__/CareerAssessmentForm.test.tsx',
      description: 'Tests career assessment flow (Requirements 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 5.4)'
    },
    {
      name: 'Component Tests - Dashboard',
      pattern: 'src/components/__tests__/EnhancedDashboard.test.tsx',
      description: 'Tests dashboard interface (Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 8.1, 8.2, 8.3, 8.4)'
    },
    {
      name: 'Component Tests - Protected Routes',
      pattern: 'src/components/__tests__/ProtectedRoute.test.tsx',
      description: 'Tests route protection (Requirements 1.1, 1.2, 4.3, 4.5)'
    },
    {
      name: 'End-to-End Tests - User Journey',
      pattern: 'src/__tests__/e2e/userJourney.test.ts',
      description: 'Tests complete user flows (All requirements validation)'
    }
  ];

  async runAllTests(): Promise<TestResult[]> {
    console.log('🚀 Starting Comprehensive Testing Suite\n');
    console.log('Testing Requirements:');
    console.log('- Authentication and Session Management (1.1, 1.2, 1.3, 1.4)');
    console.log('- Logout Functionality (2.1, 2.2, 2.3)');
    console.log('- Career Assessment Flow (3.1, 3.2, 3.3, 3.4)');
    console.log('- Domain Search and Selection (4.1, 4.2, 4.3, 4.4)');
    console.log('- Gemini AI Integration (5.1, 5.2, 5.3, 5.4)');
    console.log('- Dashboard Interface (6.1, 6.2, 6.3, 6.4, 6.5)');
    console.log('- Learning Resources (7.1, 7.2, 7.3, 7.4, 7.5)');
    console.log('- Similar Jobs Recommendation (8.1, 8.2, 8.3, 8.4)');
    console.log('- Profile Persistence (9.1, 9.2, 9.3, 9.4)');
    console.log('- Performance and Caching (10.1, 10.2, 10.3, 10.4)');
    console.log('- Domain Classification (11.1, 11.2, 11.3, 11.4, 11.5)\n');

    const results: TestResult[] = [];

    for (const suite of this.testSuites) {
      console.log(`\n📋 Running: ${suite.name}`);
      console.log(`📝 ${suite.description}`);
      
      const result = await this.runTestSuite(suite);
      results.push(result);
      
      if (result.passed) {
        console.log(`✅ ${suite.name} - PASSED (${result.duration}ms)`);
      } else {
        console.log(`❌ ${suite.name} - FAILED (${result.duration}ms)`);
        if (result.error) {
          console.log(`   Error: ${result.error}`);
        }
      }
    }

    this.printSummary(results);
    return results;
  }

  private async runTestSuite(suite: TestSuite): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      // Run the specific test suite
      const command = `npm test -- --testPathPattern="${suite.pattern}" --verbose --coverage=false`;
      
      execSync(command, { 
        stdio: 'pipe',
        timeout: 60000 // 60 second timeout per suite
      });
      
      const endTime = performance.now();
      
      return {
        suite: suite.name,
        passed: true,
        duration: Math.round(endTime - startTime)
      };
    } catch (error: any) {
      const endTime = performance.now();
      
      return {
        suite: suite.name,
        passed: false,
        duration: Math.round(endTime - startTime),
        error: error.message || 'Unknown error'
      };
    }
  }

  async runWithCoverage(): Promise<void> {
    console.log('\n📊 Running tests with coverage analysis...\n');
    
    try {
      const command = 'npm test -- --coverage --watchAll=false';
      execSync(command, { stdio: 'inherit' });
      
      console.log('\n✅ Coverage analysis complete!');
      console.log('📁 Coverage report generated in coverage/ directory');
    } catch (error: any) {
      console.log('\n❌ Coverage analysis failed:', error.message);
    }
  }

  async runPerformanceTests(): Promise<void> {
    console.log('\n⚡ Running performance-specific tests...\n');
    
    try {
      const command = 'npm test -- --testPathPattern="performance" --verbose';
      execSync(command, { stdio: 'inherit' });
      
      console.log('\n✅ Performance tests complete!');
    } catch (error: any) {
      console.log('\n❌ Performance tests failed:', error.message);
    }
  }

  private printSummary(results: TestResult[]): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUITE SUMMARY');
    console.log('='.repeat(60));
    
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`\n📈 Results:`);
    console.log(`   ✅ Passed: ${passed}/${results.length} test suites`);
    console.log(`   ❌ Failed: ${failed}/${results.length} test suites`);
    console.log(`   ⏱️  Total Duration: ${totalDuration}ms`);
    
    if (failed > 0) {
      console.log(`\n❌ Failed Test Suites:`);
      results.filter(r => !r.passed).forEach(result => {
        console.log(`   - ${result.suite}`);
        if (result.error) {
          console.log(`     Error: ${result.error.substring(0, 100)}...`);
        }
      });
    }
    
    console.log(`\n🎯 Requirements Coverage:`);
    console.log(`   - Authentication & Session: ${this.getRequirementStatus(results, 'Authentication')}`);
    console.log(`   - Career Assessment: ${this.getRequirementStatus(results, 'Assessment')}`);
    console.log(`   - AI Integration: ${this.getRequirementStatus(results, 'Gemini')}`);
    console.log(`   - Dashboard Interface: ${this.getRequirementStatus(results, 'Dashboard')}`);
    console.log(`   - Performance & Caching: ${this.getRequirementStatus(results, 'Performance')}`);
    console.log(`   - End-to-End Flows: ${this.getRequirementStatus(results, 'Journey')}`);
    
    const overallSuccess = failed === 0;
    console.log(`\n🏆 Overall Status: ${overallSuccess ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    if (overallSuccess) {
      console.log('\n🎉 Comprehensive testing suite completed successfully!');
      console.log('   All requirements have been validated through automated tests.');
    } else {
      console.log('\n⚠️  Some tests failed. Please review and fix issues before deployment.');
    }
    
    console.log('\n' + '='.repeat(60));
  }
  
  private getRequirementStatus(results: TestResult[], category: string): string {
    const categoryTests = results.filter(r => r.suite.toLowerCase().includes(category.toLowerCase()));
    if (categoryTests.length === 0) return '⚪ Not Tested';
    
    const passed = categoryTests.every(r => r.passed);
    return passed ? '✅ Passed' : '❌ Failed';
  }
}

// Export for use in other files
export { TestRunner };

// CLI usage
if (require.main === module) {
  const runner = new TestRunner();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--coverage')) {
    runner.runWithCoverage();
  } else if (args.includes('--performance')) {
    runner.runPerformanceTests();
  } else {
    runner.runAllTests().then(results => {
      const failed = results.filter(r => !r.passed).length;
      process.exit(failed > 0 ? 1 : 0);
    });
  }
}