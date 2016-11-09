/* @flow */

export default function event(): Object {
    return {
        listeners: Map,

        /**
         * @param callback
         *
         * @returns {boolean}
         *
         * @private
         */
        _isCallable: (callback) => {
            return typeof callback == "function" || false;
        },

        /**
         * @param event     String
         * @param callback  callable
         */
        addListener: (event: String, callback: () => {}) => {
            if (!this.event._isCallable(callback)) {
                return;
            }

            this.event.listeners.has(event) || this.event.listeners.set(event, []);
            this.event.listeners.get(event).push(callback);
        },

        /**
         * @param event     String
         * @param callback  callable
         */
        removeListener: (event, callback) => {
            let listeners = this.event.listeners.get(event);
            let index;

            if (listeners && listeners.length) {
                index = listeners.reduce((i, listener, index) => {
                    return (this.event._isCallable(listener) && listener === callback) ? (i = index) : i;
                }, -1);

                if (index > -1) {
                    listeners.splice(index, 1);
                    this.event.listeners.set(event, listeners);

                    return true;
                }
            }

            return false;
        },

        /**
         * @param event String
         * @param args
         *
         * @returns {boolean}
         */
        emit: (event: String, ...args) => {
            let listeners = this.event.listeners.get(event);

            if (listeners && listeners.length) {
                listeners.forEach((listener) => {
                    listener(...args);
                });

                return true;
            }

            return false;
        }
    };
}
