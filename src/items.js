export default {
    oxygen_tank: {
        id: "oxygen_tank",
        title: "Oxygen Tank",
        default_value: 100,

        action: (state, self, target) => {
            const member = target;
            member.oxygen += value;

            if (member.oxygen > 100) {
                self.value = member.oxygen - 100;
                member.oxygen = 100;
            }
        },
        value_render: (state, self) => {
            return `(${self.value}%)`;
        },
        tool_tip: (state, self, indentation) => {
            return `This oxygen tank can be\n${indentation}used to fill up a crew\n${indentation}member's oxygen.`;
        },
    }
}