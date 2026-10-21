export interface TestCaseInput {
  id: string;
  testName: string;
  description: string;
  rawInput: {
    budget?: any;
    homeType?: any;
    familySize?: any;
    children?: any;
    workingHours?: any;
    climate?: any;
    activityLevel?: any;
    experience?: any;
  };
}

export const AI_TESTING_DATASET: TestCaseInput[] = [
  {
    id: 'DS-101',
    testName: 'Tamil Nadu Tropical Family',
    description: 'Suburban house with yard, children, hot climate, moderate activity.',
    rawInput: {
      budget: 35000,
      homeType: 'house_yard',
      familySize: 4,
      children: true,
      workingHours: '4-6_hours',
      climate: 'Hot',
      activityLevel: 'moderate',
      experience: 'intermediate'
    }
  },
  {
    id: 'DS-102',
    testName: 'Urban Apartment First-Time Owner',
    description: 'Compact apartment, low exercise availability, long work hours.',
    rawInput: {
      budget: 25000,
      homeType: 'apartment',
      familySize: 2,
      children: false,
      workingHours: '8+_hours',
      climate: 'Hot',
      activityLevel: 'low',
      experience: 'first_time'
    }
  },
  {
    id: 'DS-103',
    testName: 'Incomplete Entry (Missing Budget & Climate)',
    description: 'Dataset record with null budget and unassigned climate field.',
    rawInput: {
      budget: null,
      homeType: 'house_small',
      familySize: 3,
      children: true,
      workingHours: '4-6_hours',
      climate: undefined,
      activityLevel: 'moderate',
      experience: 'first_time'
    }
  },
  {
    id: 'DS-104',
    testName: 'Corrupted & Out-of-Bounds Range',
    description: 'Negative budget (-₹15,000), negative family members, invalid climate string.',
    rawInput: {
      budget: -15000,
      homeType: 'floating_dock',
      familySize: -5,
      children: null,
      workingHours: '99_hours',
      climate: 'ARCTIC_EXTREME',
      activityLevel: 'unknown',
      experience: null
    }
  },
  {
    id: 'DS-105',
    testName: 'Madurai Farm Sighthound Guard',
    description: 'Large farm estate, expert handler, high energy native hound requirement.',
    rawInput: {
      budget: 50000,
      homeType: 'farm',
      familySize: 5,
      children: true,
      workingHours: 'work_from_home',
      climate: 'Hot',
      activityLevel: 'athlete',
      experience: 'expert'
    }
  },
  {
    id: 'DS-106',
    testName: 'Empty Null Payload Test',
    description: 'Completely unpopulated dataset payload test case.',
    rawInput: {}
  }
];
