expect.extend({
    ADeepEquals(msg, objectA, objectB) {
        const pass = received.equalTo(other);
        if (pass) {
            return {
                message: () =>
                    `expected ${other} == ${received}`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected ${other.toString()}, got ${received.toString()}\n`+msg,
                pass: false,
            };
        }
    }
});