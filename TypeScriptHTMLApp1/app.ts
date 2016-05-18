 

module App {
    "use strict";

    // Create the module and define its dependencies.
    angular.module("QtipDemo", []);


    class AngularModule {
        private AppModule: ng.IModule;

        constructor(appModule: string, dependencies: Array<string>) {
            this.AppModule = angular.module(appModule, dependencies);

        }

    }

}



