System.register(["../utils", "../logger"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils_1, logger_1;
    var Context;
    // taken from: http://stackoverflow.com/questions/3362471/how-can-i-call-a-javascript-constructor-using-call-or-apply
    // allows calling 'apply' on a constructor
    function applyToConstructor(constructor, argArray) {
        var args = [null].concat(argArray);
        var factoryFunction = constructor.bind.apply(constructor, args);
        return new factoryFunction();
    }
    function PostConstruct(target, methodName, descriptor) {
        var props = getOrCreateProps(target);
        if (!props.postConstructMethods) {
            props.postConstructMethods = [];
        }
        props.postConstructMethods.push(methodName);
    }
    exports_1("PostConstruct", PostConstruct);
    function PreDestroy(target, methodName, descriptor) {
        var props = getOrCreateProps(target);
        if (!props.preDestroyMethods) {
            props.preDestroyMethods = [];
        }
        props.preDestroyMethods.push(methodName);
    }
    exports_1("PreDestroy", PreDestroy);
    function Bean(beanName) {
        return (classConstructor) => {
            var props = getOrCreateProps(classConstructor.prototype);
            props.beanName = beanName;
        };
    }
    exports_1("Bean", Bean);
    function Autowired(name) {
        return autowiredFunc.bind(this, name, false);
    }
    exports_1("Autowired", Autowired);
    function Optional(name) {
        return autowiredFunc.bind(this, name, true);
    }
    exports_1("Optional", Optional);
    function autowiredFunc(name, optional, classPrototype, methodOrAttributeName, index) {
        if (name === null) {
            console.error('ag-Grid: Autowired name should not be null');
            return;
        }
        if (typeof index === 'number') {
            console.error('ag-Grid: Autowired should be on an attribute');
            return;
        }
        // it's an attribute on the class
        var props = getOrCreateProps(classPrototype);
        if (!props.agClassAttributes) {
            props.agClassAttributes = [];
        }
        props.agClassAttributes.push({
            attributeName: methodOrAttributeName,
            beanName: name,
            optional: optional
        });
    }
    function Qualifier(name) {
        return (classPrototype, methodOrAttributeName, index) => {
            var props;
            if (typeof index === 'number') {
                // it's a parameter on a method
                var methodName;
                if (methodOrAttributeName) {
                    props = getOrCreateProps(classPrototype);
                    methodName = methodOrAttributeName;
                }
                else {
                    props = getOrCreateProps(classPrototype.prototype);
                    methodName = 'agConstructor';
                }
                if (!props.autowireMethods) {
                    props.autowireMethods = {};
                }
                if (!props.autowireMethods[methodName]) {
                    props.autowireMethods[methodName] = {};
                }
                props.autowireMethods[methodName][index] = name;
            }
        };
    }
    exports_1("Qualifier", Qualifier);
    function getOrCreateProps(target) {
        var props = target.__agBeanMetaData;
        if (!props) {
            props = {};
            target.__agBeanMetaData = props;
        }
        return props;
    }
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            }],
        execute: function() {
            class Context {
                constructor(params) {
                    this.beans = {};
                    this.destroyed = false;
                    if (!params || !params.beans) {
                        return;
                    }
                    this.contextParams = params;
                    this.logger = new logger_1.Logger('Context', this.contextParams.debug);
                    this.logger.log('>> creating ag-Application Context');
                    this.createBeans();
                    var beans = utils_1.Utils.mapObject(this.beans, (beanEntry) => beanEntry.beanInstance);
                    this.wireBeans(beans);
                    this.logger.log('>> ag-Application Context ready - component is alive');
                }
                wireBean(bean) {
                    this.wireBeans([bean]);
                }
                wireBeans(beans) {
                    this.autoWireBeans(beans);
                    this.methodWireBeans(beans);
                    this.postConstruct(beans);
                }
                createBeans() {
                    // register all normal beans
                    this.contextParams.beans.forEach(this.createBeanEntry.bind(this));
                    // register override beans, these will overwrite beans above of same name
                    if (this.contextParams.overrideBeans) {
                        this.contextParams.overrideBeans.forEach(this.createBeanEntry.bind(this));
                    }
                    // instantiate all beans - overridden beans will be left out
                    utils_1.Utils.iterateObject(this.beans, (key, beanEntry) => {
                        var constructorParamsMeta;
                        if (beanEntry.bean.prototype.__agBeanMetaData
                            && beanEntry.bean.prototype.__agBeanMetaData.autowireMethods
                            && beanEntry.bean.prototype.__agBeanMetaData.autowireMethods.agConstructor) {
                            constructorParamsMeta = beanEntry.bean.prototype.__agBeanMetaData.autowireMethods.agConstructor;
                        }
                        var constructorParams = this.getBeansForParameters(constructorParamsMeta, beanEntry.beanName);
                        var newInstance = applyToConstructor(beanEntry.bean, constructorParams);
                        beanEntry.beanInstance = newInstance;
                        this.logger.log('bean ' + this.getBeanName(newInstance) + ' created');
                    });
                }
                createBeanEntry(Bean) {
                    var metaData = Bean.prototype.__agBeanMetaData;
                    if (!metaData) {
                        var beanName;
                        if (Bean.prototype.constructor) {
                            beanName = Bean.prototype.constructor.name;
                        }
                        else {
                            beanName = '' + Bean;
                        }
                        console.error('context item ' + beanName + ' is not a bean');
                        return;
                    }
                    var beanEntry = {
                        bean: Bean,
                        beanInstance: null,
                        beanName: metaData.beanName
                    };
                    this.beans[metaData.beanName] = beanEntry;
                }
                autoWireBeans(beans) {
                    beans.forEach(bean => this.autoWireBean(bean));
                }
                methodWireBeans(beans) {
                    beans.forEach(bean => this.methodWireBean(bean));
                }
                autoWireBean(bean) {
                    if (!bean
                        || !bean.__agBeanMetaData
                        || !bean.__agBeanMetaData.agClassAttributes) {
                        return;
                    }
                    var attributes = bean.__agBeanMetaData.agClassAttributes;
                    if (!attributes) {
                        return;
                    }
                    var beanName = this.getBeanName(bean);
                    attributes.forEach((attribute) => {
                        var otherBean = this.lookupBeanInstance(beanName, attribute.beanName, attribute.optional);
                        bean[attribute.attributeName] = otherBean;
                    });
                }
                getBeanName(bean) {
                    var constructorString = bean.constructor.toString();
                    var beanName = constructorString.substring(9, constructorString.indexOf('('));
                    return beanName;
                }
                methodWireBean(bean) {
                    var autowiredMethods;
                    if (bean.__agBeanMetaData) {
                        autowiredMethods = bean.__agBeanMetaData.autowireMethods;
                    }
                    utils_1.Utils.iterateObject(autowiredMethods, (methodName, wireParams) => {
                        // skip constructor, as this is dealt with elsewhere
                        if (methodName === 'agConstructor') {
                            return;
                        }
                        var beanName = this.getBeanName(bean);
                        var initParams = this.getBeansForParameters(wireParams, beanName);
                        bean[methodName].apply(bean, initParams);
                    });
                }
                getBeansForParameters(parameters, beanName) {
                    var beansList = [];
                    if (parameters) {
                        utils_1.Utils.iterateObject(parameters, (paramIndex, otherBeanName) => {
                            var otherBean = this.lookupBeanInstance(beanName, otherBeanName);
                            beansList[Number(paramIndex)] = otherBean;
                        });
                    }
                    return beansList;
                }
                lookupBeanInstance(wiringBean, beanName, optional = false) {
                    if (beanName === 'context') {
                        return this;
                    }
                    else if (this.contextParams.seed && this.contextParams.seed.hasOwnProperty(beanName)) {
                        return this.contextParams.seed[beanName];
                    }
                    else {
                        var beanEntry = this.beans[beanName];
                        if (beanEntry) {
                            return beanEntry.beanInstance;
                        }
                        if (!optional) {
                            console.error('ag-Grid: unable to find bean reference ' + beanName + ' while initialising ' + wiringBean);
                        }
                        return null;
                    }
                }
                postConstruct(beans) {
                    beans.forEach((bean) => {
                        // try calling init methods
                        if (bean.__agBeanMetaData && bean.__agBeanMetaData.postConstructMethods) {
                            bean.__agBeanMetaData.postConstructMethods.forEach((methodName) => bean[methodName]());
                        }
                    });
                }
                getBean(name) {
                    return this.lookupBeanInstance('getBean', name, true);
                }
                destroy() {
                    // should only be able to destroy once
                    if (this.destroyed) {
                        return;
                    }
                    this.logger.log('>> Shutting down ag-Application Context');
                    // try calling destroy methods
                    utils_1.Utils.iterateObject(this.beans, (key, beanEntry) => {
                        var bean = beanEntry.beanInstance;
                        if (bean.__agBeanMetaData && bean.__agBeanMetaData.preDestroyMethods) {
                            bean.__agBeanMetaData.preDestroyMethods.forEach((methodName) => bean[methodName]());
                        }
                    });
                    this.destroyed = true;
                    this.logger.log('>> ag-Application Context shut down - component is dead');
                }
            }
            exports_1("Context", Context);
        }
    }
});
//# sourceMappingURL=context.js.map