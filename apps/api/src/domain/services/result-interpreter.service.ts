import { IResultInterpreter } from './result-interpreter.interface';
import { TestType } from '../value-objects/test-type.vo';
import { ConfidenceScore } from '../value-objects/confidence-score.vo';

export class ResultInterpreterService implements IResultInterpreter {
  interpretResult(
    testType: TestType,
    confidenceScore: ConfidenceScore,
  ): {
    interpretation: string;
    recommendation: string;
  } {
    const score = confidenceScore.getValue();
    const interpretation = confidenceScore.getInterpretation();
    
    let result = {
      interpretation: '',
      recommendation: '',
    };

    switch (testType) {
      case TestType.TB:
        result = this.interpretTBResult(score);
        break;
      case TestType.COVID19:
        result = this.interpretCOVIDResult(score);
        break;
      case TestType.SMOKING:
        result = this.interpretSmokingResult(score);
        break;
    }

    return result;
  }

  private interpretTBResult(score: number): { interpretation: string; recommendation: string } {
    if (score === 0.5) {
      return {
        interpretation: 'Test results are inconclusive for TB',
        recommendation: 'Please consult with a healthcare provider for further evaluation',
      };
    }
    return {
      interpretation: `${score > 0.5 ? 'High' : 'Low'} probability of TB detected`,
      recommendation: score > 0.5 
        ? 'Immediate medical consultation recommended'
        : 'Regular health monitoring advised',
    };
  }

  private interpretCOVIDResult(score: number): { interpretation: string; recommendation: string } {
    if (score === 0.5) {
      return {
        interpretation: 'Test results are inconclusive for COVID-19',
        recommendation: 'Consider retesting and follow local health guidelines',
      };
    }
    return {
      interpretation: `${score > 0.5 ? 'High' : 'Low'} probability of COVID-19 detected`,
      recommendation: score > 0.5
        ? 'Self-isolate and seek medical attention'
        : 'Continue following preventive measures',
    };
  }

  private interpretSmokingResult(score: number): { interpretation: string; recommendation: string } {
    if (score === 0.5) {
      return {
        interpretation: 'Smoking habit analysis is inconclusive',
        recommendation: 'Consider additional health assessments',
      };
    }
    return {
      interpretation: `${score > 0.5 ? 'High' : 'Low'} probability of smoking habit detected`,
      recommendation: score > 0.5
        ? 'Consider smoking cessation programs'
        : 'Maintain healthy lifestyle habits',
    };
  }
}
