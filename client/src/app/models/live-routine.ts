import Routine from './routine';
import Stretch from './stretch';

type EventHandler = () => void;
type Unsubscribe = () => void;

enum LiveRoutineEvent {
  StretchChanged,
  StretchRemainingSecondsChanged,
}

class LiveRoutineEventHandlers {
  [LiveRoutineEvent.StretchChanged]: EventHandler[] = [];
  [LiveRoutineEvent.StretchRemainingSecondsChanged]: EventHandler[] = [];
}

class LiveRoutine {
  private _currentStretch: Stretch | undefined;
  private _currentStretchRemainingSeconds = 0;

  private eventHandlers = new LiveRoutineEventHandlers();

  get currentStretch(): Stretch | undefined {
    return this._currentStretch;
  }

  get currentStretchRemainingSeconds(): number {
    return this._currentStretchRemainingSeconds;
  }

  constructor(private routine: Routine) {
    const processedStretches = [];

    for (const stretch of this.routine.stretches) {
      stretch.instructions?.sort((a, b) => a.order - b.order);

      if (stretch.isUnilateral) {
        const unilateralStretches: Stretch[] = ['Left', 'Right'].map((side) => {
          return {
            id: stretch.id,
            name: `${side} ${stretch.name}`,
            isUnilateral: true,
            instructions: stretch.instructions,
          };
        });
        processedStretches.push(...unilateralStretches);
      } else {
        processedStretches.push(stretch);
      }
    }

    this.routine.stretches = processedStretches;
  }

  async start(): Promise<void> {
    for (const stretch of this.routine.stretches) {
      this.setCurrentStretch(stretch);

      for (
        let remainingSeconds = this.routine.stretchSecondsDuration;
        remainingSeconds >= 0;
        remainingSeconds--
      ) {
        this.setCurrentStretchRemainingSeconds(remainingSeconds);

        await this.setTimeoutAsync(1000);
      }
    }
  }

  private setCurrentStretch(stretch: Stretch): void {
    this._currentStretch = stretch;
    this.raise(LiveRoutineEvent.StretchChanged);
  }

  private setCurrentStretchRemainingSeconds(remainingSeconds: number): void {
    this._currentStretchRemainingSeconds = remainingSeconds;
    this.raise(LiveRoutineEvent.StretchRemainingSecondsChanged);
  }

  private setTimeoutAsync(duration: number): Promise<void> {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, duration);
    });
  }

  subscribe(event: LiveRoutineEvent, handler: EventHandler): Unsubscribe {
    this.eventHandlers[event].push(handler);

    return () => this.unsubcribe(event, handler);
  }

  private raise(event: LiveRoutineEvent): void {
    this.eventHandlers[event].forEach((handler) => handler());
  }

  private unsubcribe(event: LiveRoutineEvent, handler: EventHandler): void {
    this.eventHandlers[event] = this.eventHandlers[event].filter(
      (h) => h !== handler
    );
  }
}

export default LiveRoutine;

export { LiveRoutineEvent };
