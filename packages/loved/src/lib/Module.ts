export type Plugin = {
    name: string
};

/**
 * A module that can hold plugins
 */
export class Module<TPlugin extends Plugin = Plugin> {
    constructor(public plugins: TPlugin[] = []) {}

    addPlugin(plugin: TPlugin) {
        this.plugins.push(plugin);
    }

    removePlugin(name: string) {
        this.plugins = this.plugins.filter(plugin => plugin.name !== name);
    }
}
