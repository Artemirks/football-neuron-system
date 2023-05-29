# HN - Home Near
# AN - Away Near
# HM - Home Midle
# AM - Away Midle
# HL - Home Long
# AL - Away Long
import numpy as np
import sys
import json

def relu(x):
    return (x > 0) * x

def create_input_values(input_all):
    inputHN = np.array([input_all[0], input_all[6], input_all[7]])
    inputAN = np.array([input_all[1], input_all[8], input_all[9]])
    inputHM = np.array([input_all[2], input_all[10], input_all[11]])
    inputAM = np.array([input_all[3], input_all[12], input_all[13]])
    inputHL = np.array([input_all[4], input_all[14], input_all[15]])
    inputAL = np.array([input_all[5], input_all[16], input_all[17]])
    return [inputHN, inputAN, inputHM, inputAM, inputHL, inputAL]

def neural_network(input, weights):
    predHN = input[0].dot(weights[0])
    predHN = relu(predHN)
    predAN = input[1].dot(weights[1])
    predAN = relu(predAN)
    predHM = input[2].dot(weights[2])
    predHM = relu(predHM)
    predAM = input[3].dot(weights[3])
    predAM = relu(predAM)
    predHL = input[4].dot(weights[4])
    predHL = relu(predHL)
    predAL = input[5].dot(weights[5])
    predAL = relu(predAL)
    inputH = np.array([predHN, predHM, predHL])
    inputH = relu(inputH)
    inputA = np.array([predAN, predAM, predAL])
    inputA = relu(inputA)
    predH = inputH.dot(weights[6])
    predH = relu(predH)
    predA = inputA.dot(weights[7])
    predA = relu(predA)
    input_output = np.array([predH, predA])
    pred = input_output.dot(weights[8])
    #return [pred, input[0], input[1], input[2], input[3], input[4], input[5], inputH, inputA, input_output]
    return pred


def count_weght_deltas(pred, input_value, true):
    delta = pred - true
    weight_deltas = input_value * delta
    return weight_deltas


alpha = 0.001

weightsHN_homePred = [0.23282660758672075, 0.4245848573082086, -1.4858826902068334]
weightsAN_homePred = [1.2258061980842032, 0.032467239521939265, 0.5767377796155047]
weightsHM_homePred = [-4.760811084494791, -18.27600401509888, -0.27146097953428666]
weightsAM_homePred = [1.2420227347091422, -8.078193164411868, 0.7130687594824299]
weightsHL_homePred = [0.9782926201272317, 0.16635788801282347, -0.566860603862889]
weightsAL_homePred = [-1.1995726224061871, -1.5998495692675656, -0.7419907496237619]

weightsH_homePred = [0.45751198809233806, 0.2714760297471356, 0.41124295783356507]
weightsA_homePred = [0.9252870302859599, 0.3054738687878218, 0.03571850859258864]

weights_output_homePred = [0.7135045774949722, 0.5233457059475882]

weightsHN_awayPred = [0.8864082891488735, 0.542127428091521, -0.10763368960425033]
weightsAN_awayPred = [0.1669411279665469, 0.4935378626834588, -0.1595081315106861]
weightsHM_awayPred = [-4.3911159431390505, 0.7624902028405541, -1.2604861245738745]
weightsAM_awayPred = [-0.8974348753437569, 0.3076844382140544, -0.3504531072620219]
weightsHL_awayPred = [-0.4793362622744427, 0.6489260789586443, -1.172283169906226]
weightsAL_awayPred = [1.8170419008222127, -2.5241086835964333, 2.8301041155955686]

weightsH_awayPred = [0.5686061901531032, 0.37038827316778467, 0.5719774828963071]
weightsA_awayPred = [0.2601509505461398, 0.4261148016600683, 0.3979576122191299]

weights_output_awayPred = [0.37012083354086944, 0.6828810541605319]

true_output_home = [1, 1, 2, 2, 4, 1, 3, 1, 0.3, 1, 1.4, 2, 1.3, 2, 0]
true_output_away = [0.3, 1, 2, 1, 3, 2, 2, 1, 1, 2, 1.6, 0.3, 1, 2, 1]

weights_homePred = [weightsHN_homePred, weightsAN_homePred, weightsHM_homePred, weightsAM_homePred,
                    weightsHL_homePred, weightsAL_homePred, weightsH_homePred, weightsA_homePred,
                    weights_output_homePred]

weights_awayPred = [weightsHN_awayPred, weightsAN_awayPred, weightsHM_awayPred, weightsAM_awayPred,
                    weightsHL_awayPred, weightsAL_awayPred, weightsH_awayPred, weightsA_awayPred,
                    weights_output_awayPred]

# Читаем данные из stdin и вызываем функцию predict
inputData = json.loads(sys.stdin.read())

if inputData["position"] == "home":
    pred = neural_network(create_input_values(inputData["values"]), weights_homePred)
else:
    pred = neural_network(create_input_values(inputData["values"]), weights_awayPred)

# Отправляем результат в stdout
print(json.dumps(pred))
