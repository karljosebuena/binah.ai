export type TestType = 'TB' | 'COVID19' | 'SMOKING';

export type ProcessingStatus = 'INCOMPLETE' | 'COMPLETE_SUCCESS' | 'COMPLETE_ERROR' | 'COMPLETE_FAILURE';

export interface User {
  id: string;
  sessionId: string;
}
