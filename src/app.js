function Game() {
    var self = this;

    self.Debug = (msg) => {
        console.log(msg);
    };
    
    self.Validate = (args, caller) => {
        //shared validations
        if (args.length < args.callee.length){
            console.log("Incorrect number of arguements for ", caller);
            return;
        }
    }

    self.Source = {
        _utils: {
            CreateObject(name, desc, actions) {
                self.Validate(arguments, this);
                if (actions.length) {
                    for (action in actions) {
                        if (!self.Source.Objects.hasOwnProperty(actions[action])){
                            self.Debug("This action doesn't exist");
                        }
                    }
                }else {
                    console.log("Please provide an array of actions");
                }
                self.Source.Objects[name] = {text: name, desc: desc, actions: actions};
            },
            CreateAction(name, desc, effect) {
                //needs validations
                self.Validate(arguments, this);
                self.Source.Actions[name] = {text: name,desc: desc, effect: effect};
            },
            CreateRoom(name, desc, objects, nextRooms) {
                return {
                    Room: {
                        name: name,
                        desc: desc,
                        objects: objects, //grab from source.objects - obj must exist already to ref it
                        nextRooms: nextRooms //grab from state.rooms
                    }
                }
            }
        },
        Objects: {},
        Actions: {},
        Effects: {},
        Rooms: {}
    };

    self.State = {
        hp: 100,
        xp: 0,
        log: [],
        room: null,
        roomObjects: []
    };

    self.Engine = {
        Start(creation) {
            creation();
            console.log(self, "Is starting");
        }
    }
}

var g = new Game();

var template = () => {
    let utils = g.Source._utils;
    utils.CreateAction("Hit");
    utils.CreateObject("Lamp", "A lamp", ["Hitz"]);
};

g.Engine.Start(template);