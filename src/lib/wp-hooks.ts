type HookCallback = (...args: any[]) => any;

interface HookEntry {
  callback: HookCallback;
  priority: number;
}

class WPHooks {
  private actions: Record<string, HookEntry[]> = {};
  private filters: Record<string, HookEntry[]> = {};

  private addHook(hooksMap: Record<string, HookEntry[]>, hookName: string, callback: HookCallback, priority: number = 10) {
    if (!hooksMap[hookName]) {
      hooksMap[hookName] = [];
    }
    hooksMap[hookName].push({ callback, priority });
    hooksMap[hookName].sort((a, b) => a.priority - b.priority);
  }

  public addAction(hookName: string, callback: HookCallback, priority: number = 10) {
    this.addHook(this.actions, hookName, callback, priority);
  }

  public async doAction(hookName: string, ...args: any[]) {
    const hooks = this.actions[hookName] || [];
    for (const hook of hooks) {
      await hook.callback(...args);
    }
  }

  public addFilter(hookName: string, callback: HookCallback, priority: number = 10) {
    this.addHook(this.filters, hookName, callback, priority);
  }

  public applyFilters(hookName: string, value: any, ...args: any[]) {
    const hooks = this.filters[hookName] || [];
    let result = value;
    for (const hook of hooks) {
      result = hook.callback(result, ...args);
    }
    return result;
  }
}

// Global instance to act as the WP engine state
const wp = new WPHooks();

export const add_action = wp.addAction.bind(wp);
export const do_action = wp.doAction.bind(wp);
export const add_filter = wp.addFilter.bind(wp);
export const apply_filters = wp.applyFilters.bind(wp);
