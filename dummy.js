function useEffect(callback, dependencies = []) {
  let effect_is_run = false;
  let run_counts = 0;
  let oldDependencies = dependencies;
  // then execute callback whenever dependencies change

  const beforeEffect = (beforeCallback = null) => {
    if (beforeCallback) {
      if (!effect_is_run) {
        // do something before the effect
        beforeCallback();
        // do something maybe run effect
        runEffect();
        console.log('We Started Effect!');
      } else {
        console.error(`No Effect Was Already Run!`);
      }
    } else {
      console.error(`No Before Effect Declared!`);
    }
  };

  // execute callback or effect once, intially
  const runEffect = () => {
    callback();
    effect_is_run = true;
  };

  const afterEffect = (afterCallback = null) => {
    if (afterCallback) {
      if (effect_is_run) {
        // do something after the effect
        afterCallback();
        // remove callback context maybe
        console.log('We done!');
      } else {
        runEffect();
        afterCallback();
      }
    } else {
      console.error(`No After Effect Declared!`);
    }
  };

  // run intially
  runEffect();

  if (effect_is_run) {
    afterEffect(() => {
      run_counts++;
      console.log('run counts:', run_counts);
    });
  }

  // export
  return { beforeEffect, afterEffect, dependencies, run_counts };
}

useEffect(() => console.log('Hello once!'), []);
