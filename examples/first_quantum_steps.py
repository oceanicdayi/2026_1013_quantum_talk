"""量子演講的第一個Python實驗：理想模擬，不是真實量子硬體。

純Python：python first_quantum_steps.py
Qiskit：python -m pip install qiskit
        python first_quantum_steps.py --qiskit

先預測H—Rz—H及Bell態，再執行；記錄seed、shots、版本與結果。
官方入口：https://quantum.cloud.ibm.com/docs/en/guides/quick-start
"""
import argparse
import cmath
import importlib.metadata
import json
import math
import random
import sys


def apply(matrix, state):
    return [sum(a * b for a, b in zip(row, state)) for row in matrix]


def interference(degrees):
    h = [[1 / math.sqrt(2), 1 / math.sqrt(2)],
         [1 / math.sqrt(2), -1 / math.sqrt(2)]]
    phi = math.radians(degrees)
    rz = [[cmath.exp(-1j * phi / 2), 0], [0, cmath.exp(1j * phi / 2)]]
    state = apply(h, apply(rz, apply(h, [1, 0])))
    return [abs(a) ** 2 for a in state]


def sample(labels, probabilities, shots, seed):
    rng = random.Random(seed)
    counts = dict.fromkeys(labels, 0)
    for result in rng.choices(labels, weights=probabilities, k=shots):
        counts[result] += 1
    return counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--qiskit', action='store_true', help='使用Qiskit本機Statevector')
    parser.add_argument('--shots', type=int, default=1024)
    parser.add_argument('--seed', type=int, default=20261013)
    args = parser.parse_args()
    if args.shots < 1:
        parser.error('shots 必須為正整數')
    report = {'mode': 'ideal local simulation', 'python': sys.version.split()[0],
              'shots': args.shots, 'seed': args.seed, 'interference': []}
    if args.qiskit:
        try:
            from qiskit import QuantumCircuit
            from qiskit.quantum_info import Statevector
        except ImportError:
            parser.error('請先執行 python -m pip install qiskit，或移除 --qiskit 使用純Python模式')
        report['qiskit'] = importlib.metadata.version('qiskit')
    for degrees in (0, 90, 180, 270, 360):
        if args.qiskit:
            circuit = QuantumCircuit(1)
            circuit.h(0)
            circuit.rz(math.radians(degrees), 0)
            circuit.h(0)
            state = Statevector.from_instruction(circuit)
            probabilities = list(map(float, state.probabilities()))
            state.seed(args.seed)
            counts = {str(k): int(v) for k, v in state.sample_counts(shots=args.shots).items()}
        else:
            probabilities = interference(degrees)
            counts = sample(['0', '1'], probabilities, args.shots, args.seed)
        report['interference'].append({'phase_degrees': degrees,
                                     'probabilities': probabilities, 'counts': counts})
    if args.qiskit:
        bell = QuantumCircuit(2)
        bell.h(0)
        bell.cx(0, 1)
        state = Statevector.from_instruction(bell)
        state.seed(args.seed)
        counts = {str(k): int(v) for k, v in state.sample_counts(shots=args.shots).items()}
    else:
        counts = sample(['00', '01', '10', '11'], [.5, 0, 0, .5], args.shots, args.seed)
    report['bell'] = {'ideal_probabilities': {'00': .5, '01': 0, '10': 0, '11': .5},
                      'counts': counts}
    report['learning_questions'] = [
        '改變相位時，最後一個H如何改變測量機率？',
        '增加shots後，抽樣比例如何接近理論機率？',
        '只有00/11的相關性為何不足以證明糾纏？下一步可學X/Z基底與CHSH。',
        '模擬器能顯示所有振幅，但真實QPU可以直接讀出它們嗎？'
    ]
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
