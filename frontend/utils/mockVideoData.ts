import { VideoHistoryItem } from "@/context/WorkspaceContext";

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function isValidYouTubeUrl(url: string): boolean {
  if (!url || !url.trim()) return false;
  return Boolean(extractYouTubeId(url));
}

export function timeStringToSeconds(time: string): number {
  if (!time) return 0;
  const parts = time.replace(/[^\d:]/g, "").split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

export function openYouTubeAtTimestamp(videoId: string, timestamp: string | number): void {
  const seconds = typeof timestamp === "number" ? timestamp : timeStringToSeconds(timestamp);
  const targetUrl = `https://www.youtube.com/watch?v=${videoId}&t=${seconds}s`;
  window.open(targetUrl, "_blank", "noopener,noreferrer");
}

export function getMockVideoAnalysis(url: string): VideoHistoryItem {
  const videoId = extractYouTubeId(url) || "kCc8FmEb1nY";
  
  return {
    id: videoId,
    url: url,
    title: "Neural Networks from Scratch: Intuition and Math",
    channel: "3Blue1Brown",
    duration: "18:45",
    timestamp: "Just now",
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    fallbackThumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    executiveSummary: "This video establishes the architectural and mathematical foundations of artificial neural networks. It proves why stacked linear matrix multiplications mathematically collapse without non-linear activation functions, formalizes cost surfaces for error measurement, and derives backpropagation via the multivariate calculus chain rule.",
    structuredSummary: [
      {
        id: 1,
        title: "Foundations of Representation & Single Neurons",
        explanation: "An artificial neuron evaluates affine transformations by computing weighted sums $z = \\sum (w_i x_i) + b$. Without non-linear activation functions, multiple layered compositions algebraically collapse into a single affine transformation ($W_2(W_1 x) = W_{combined} x$).",
        keyPoints: [
          "Linear layer stacking without activations loses all functional depth benefits.",
          "Weights determine connection strengths while bias thresholds determine baseline firing sensitivity.",
          "Neurons represent multidimensional input vectors as singular scalar activations."
        ],
        startTimestamp: "02:15",
        endTimestamp: "05:30",
        startSeconds: 135
      },
      {
        id: 2,
        title: "Activation Dynamics & Non-Linearity",
        explanation: "Non-linear activations like ReLU ($max(0, x)$) and Sigmoid curve decision boundaries across hyperplanes, preventing gradient saturation in deep multi-layer architectures.",
        keyPoints: [
          "ReLU sets negative activations to zero while preserving a constant gradient of 1 for positive inputs.",
          "Non-linearities empower networks to solve non-linearly separable partitions such as the XOR problem.",
          "Vanishing gradients are mitigated by avoiding saturated flat regions."
        ],
        startTimestamp: "06:10",
        endTimestamp: "10:45",
        startSeconds: 370
      },
      {
        id: 3,
        title: "Loss Formulation & Cost Minimization",
        explanation: "Divergence between model predictions $\\hat{y}$ and ground truth observations $y$ is evaluated via differentiable loss functions such as Mean Squared Error and Cross-Entropy.",
        keyPoints: [
          "Cost functions must be continuous and differentiable to permit gradient computation.",
          "High-dimensional cost surfaces are navigated using parameter step optimization.",
          "Error magnitude dictates the scale of required weight adjustments."
        ],
        startTimestamp: "11:05",
        endTimestamp: "13:30",
        startSeconds: 665
      },
      {
        id: 4,
        title: "Backpropagation via Multivariate Chain Rule",
        explanation: "Error gradients $\\frac{\\partial C}{\\partial w_{ij}}$ are iteratively computed backward from final outputs to early layers, enabling Gradient Descent parameter updates: $w \\leftarrow w - \\eta \\nabla C$.",
        keyPoints: [
          "The multivariate calculus chain rule enables recursive gradient calculation without redundant matrix recalculation.",
          "Learning rate ($\\eta$) governs step length across the negative gradient vector.",
          "Iterative parameter updates converge weights toward minimal empirical error."
        ],
        startTimestamp: "13:40",
        endTimestamp: "18:10",
        startSeconds: 820
      }
    ],
    takeaways: [
      "Linear layer stacking without non-linear activations mathematically collapses into a single-layer matrix multiplication.",
      "Activation functions introduce curvature and non-linearity, allowing neural networks to solve problems like XOR.",
      "Cost functions measure error discrepancy and must be differentiable to permit gradient computation.",
      "Backpropagation applies the multivariate chain rule to systematically calculate weight derivatives from output to input.",
      "Learning rate (η) governs step size in parameter space; too large oscillates, too small stalls convergence."
    ],
    takeawaysWithMeta: [
      {
        id: 1,
        title: "Linear Collapse without Activations",
        text: "Linear layer stacking without non-linear activations mathematically collapses into a single-layer matrix multiplication.",
        timestamp: "04:30",
        seconds: 270
      },
      {
        id: 2,
        title: "Curvature & Non-Linear Mapping",
        text: "Activation functions introduce curvature and non-linearity, allowing neural networks to solve complex boundary partitions.",
        timestamp: "06:10",
        seconds: 370
      },
      {
        id: 3,
        title: "Differentiable Cost Formulation",
        text: "Cost functions measure prediction discrepancy and must be differentiable to permit gradient descent updates.",
        timestamp: "11:05",
        seconds: 665
      },
      {
        id: 4,
        title: "Chain Rule Backpropagation",
        text: "Backpropagation applies the multivariate chain rule to systematically calculate weight derivatives from output to input.",
        timestamp: "13:40",
        seconds: 820
      },
      {
        id: 5,
        title: "Learning Rate Optimization",
        text: "The learning rate (η) governs step size in parameter space; too large oscillates, too small stalls convergence.",
        timestamp: "16:20",
        seconds: 980
      }
    ],
    transcript: [
      { time: "00:00", seconds: 0, text: "Welcome to this deep dive into the mathematical architecture of artificial neural networks." },
      { time: "00:45", seconds: 45, text: "Let's first define what a single artificial neuron actually computes on its input vectors." },
      { time: "02:15", seconds: 135, text: "A neuron takes input activations, multiplies each by a learnable weight, and adds a bias offset." },
      { time: "04:30", seconds: 270, text: "Notice that if we only perform matrix multiplication, ten hidden layers behave exactly like one layer." },
      { time: "06:10", seconds: 370, text: "This is why non-linear activation functions like Sigmoid and ReLU are indispensable." },
      { time: "08:24", seconds: 504, text: "ReLU sets all negative inputs to zero while preserving positive inputs with a constant derivative of 1." },
      { time: "11:05", seconds: 665, text: "Now we need a metric to quantify how far our prediction is from the target: the cost function." },
      { time: "13:40", seconds: 820, text: "Using gradient descent, we calculate the partial derivatives of the cost with respect to every weight." },
      { time: "16:20", seconds: 980, text: "Backpropagation applies the chain rule backward layer by layer, reusing intermediate computations." },
      { time: "18:10", seconds: 1090, text: "In summary, weights adjust iteratively until predictions match ground-truth observations." }
    ],
    quiz: [
      {
        id: 1,
        question: "What happens mathematically if a neural network has multiple hidden layers but NO activation functions?",
        options: [
          "A. The network becomes unable to calculate backpropagation.",
          "B. The multiple layers mathematically collapse into a single linear transformation.",
          "C. The weights automatically diverge to infinity.",
          "D. The cost function becomes zero everywhere."
        ],
        correctIndex: 1,
        explanation: "Since matrix multiplications are linear, multiplying multiple weight matrices ($W_2 W_1 x$) simply produces another single weight matrix $W_{combined} x$, losing all multi-layer depth advantages.",
        sourceTimestamp: "04:30",
        sourceSeconds: 270
      },
      {
        id: 2,
        question: "Why is ReLU often preferred over Sigmoid in hidden layers of deep networks?",
        options: [
          "A. ReLU prevents vanishing gradient problems for positive activations by maintaining a gradient of 1.",
          "B. ReLU requires complex trigonometry to calculate.",
          "C. ReLU restricts outputs strictly between 0 and 1.",
          "D. ReLU removes the need for weight matrices."
        ],
        correctIndex: 0,
        explanation: "Sigmoid saturates near 0 and 1 where its derivative approaches zero, causing vanishing gradients. ReLU ($max(0, x)$) maintains a constant derivative of 1 for all positive values.",
        sourceTimestamp: "08:24",
        sourceSeconds: 504
      },
      {
        id: 3,
        question: "What mathematical theorem underlies the backpropagation algorithm?",
        options: [
          "A. The Pythagorean Theorem",
          "B. The Multivariate Chain Rule of Calculus",
          "C. Fourier Series Expansion",
          "D. Bayes' Theorem"
        ],
        correctIndex: 1,
        explanation: "Backpropagation uses the calculus chain rule to compute partial derivatives of composite nested functions from the loss backward through the layers.",
        sourceTimestamp: "13:40",
        sourceSeconds: 820
      },
      {
        id: 4,
        question: "What does the bias parameter in a neuron do?",
        options: [
          "A. It prevents weights from changing during gradient descent.",
          "B. It shifts the activation function curve along the axis to allow better fitting.",
          "C. It speeds up video transcript extraction.",
          "D. It normalizes inputs between 0 and 255."
        ],
        correctIndex: 1,
        explanation: "Bias allows the activation threshold to be shifted independently of the input values, enabling the neuron to fire even when all inputs are zero.",
        sourceTimestamp: "02:15",
        sourceSeconds: 135
      },
      {
        id: 5,
        question: "What is the primary role of the learning rate in Gradient Descent?",
        options: [
          "A. It sets the size of the parameter updates in the direction of the negative gradient.",
          "B. It determines the number of neurons in the input layer.",
          "C. It calculates the video frame rate.",
          "D. It selects the embedding model."
        ],
        correctIndex: 0,
        explanation: "The learning rate ($\\eta$) scales the gradient step. A high rate may overshoot the minimum, while a very small rate causes slow convergence.",
        sourceTimestamp: "16:20",
        sourceSeconds: 980
      }
    ]
  };
}
