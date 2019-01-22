export default {
    oxygen_tank: {
        id: "oxygen_tank",
        title: "Oxygen Tank",
        default_value: 100,

        action: (state, self, target) => {
            const member = target;
            let rest = 0;
            member.oxygen += self.value;

            if (member.oxygen > 100) {
                rest = member.oxygen - 100;
                self.value = rest;
                member.oxygen = 100;
            }

            return `"${member.name}" used ${100 - rest}% of the oxygen in the tank!`;
        },
        value_render: (state, self) => {
            return `(${self.value}%)`;
        },
        tool_tip: (state, self, indentation) => {
            return `This oxygen tank can be\n${indentation}used to fill up a crew\n${indentation}member's oxygen.`;
        },
    }
}