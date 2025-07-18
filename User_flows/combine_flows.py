import os
import json
import itertools
import random

flows_folder = './original_flows'

flow_names = [f for f in os.listdir(flows_folder) if f.endswith('.json')]

all_flows_by_file = []

for flow_name in flow_names:
    file_path = os.path.join(flows_folder, flow_name)
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

        sub_flow_count = 0

        sub_flows = []
        if isinstance(data, list):
            for user_flow in data:
                if 'flows' in user_flow and isinstance(user_flow['flows'], list):
                    for flow in user_flow['flows']:
                        sub_flows.append({
                            "flow_id_from_original": flow.get("flow_id"),
                            "steps": flow.get("steps", [])
                        })
                    print("len(sub_flows): ", len(sub_flows))

        all_flows_by_file.append(sub_flows)

print("len(all_flows_by_file): ", len(all_flows_by_file))

all_combinations = list(itertools.product(*all_flows_by_file)) #720 in total
print(len(all_combinations))

'''Save all possible combinations'''
output = [
    {
        "combination_ID": str(idx + 1),
        "combined_flows": list(combo)
    }
    for idx, combo in enumerate(all_combinations)
]

# with open('combined_flow_combinations.json', 'w', encoding='utf-8') as f:
#     json.dump(output, f, indent=2)

'''Randomly sample ID 1-720'''
all_ids = list(range(1, len(all_combinations) + 1))
random.shuffle(all_ids)

group_size = 40
num_groups = 18
groups = [all_ids[i * group_size:(i + 1) * group_size] for i in range(num_groups)]

for i, group in enumerate(groups, 1):
    print(f"Group {i}: {group}")
