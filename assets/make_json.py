import json
import numpy as np
import torch
from pathlib import Path

flow_path = Path('./cat.v4.tilt30/tilt30_fixed.pth')
flow_path = Path('./topiary.v1.heavyFatBG/flow.pth')

flow = torch.load(flow_path)
flow = flow.numpy()[0]

dirs_grid = []
for i in range(512):
    dirs_row = []
    for j in range(512):
        dx, dy = flow[:, i, j]
        dx = np.round(dx)
        dy = np.round(dy)
        dirs_row.append([int(dx), int(dy)])
    dirs_grid.append(dirs_row)

with open(flow_path.with_suffix('.json'), 'w') as f:
    json.dump(dirs_grid, f)
