export interface Command<I, O> {
  execute(inputData: I): O;
}
