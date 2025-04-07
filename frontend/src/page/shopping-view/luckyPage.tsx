import { fecthallDiscountCode, spiningResult } from '@/store/shopping/userDiscount-slice';
import { AppDispatch, RootState } from '@/store/store';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const LuckyWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [discountWinId, setDiscountWinId] = useState<number>(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const {discountList} = useSelector((state: RootState) => state.userDiscount);
  const {user} = useSelector((state: RootState) => state.adminAuth);
  useEffect(() => {
    dispatch(fecthallDiscountCode())
  }, [dispatch])

  const sliceAngle = 360 / discountList.length;

  const createConfetti = () => {
    if (!containerRef.current) return;

    const confettiCount = 200;
    const confettiElements: HTMLElement[] = [];

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'absolute w-2 h-2 rounded-full';
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}deg, 100%, 50%)`;
      confetti.style.top = '50%';
      confetti.style.left = '50%';
      confetti.style.transform = 'translate(-50%, -50%)';
      confetti.style.position = 'absolute';
      confetti.style.pointerEvents = 'none';

      const angle = Math.random() * Math.PI * 2;
      const velocity = 5 + Math.random() * 10;
      const size = Math.floor(Math.random() * 10) + 5;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;

      const animation = confetti.animate(
        [
          { transform: 'translate(-50%, -50%)', opacity: 1 },
          {
            transform: `translate(
              calc(-50% + ${Math.cos(angle) * velocity * 20}px), 
              calc(-50% + ${Math.sin(angle) * velocity * 20}px)
            )`,
            opacity: 0
          }
        ],
        {
          duration: 1000 + Math.random() * 1000,
          easing: 'cubic-bezier(.4,0,.2,1)'
        }
      );

      animation.onfinish = () => {
        if (confetti.parentNode) {
          confetti.remove();
        }
      };

      containerRef.current.appendChild(confetti);
      confettiElements.push(confetti);
    }

    setTimeout(() => {
      confettiElements.forEach(el => {
        if (el.parentNode) {
          el.remove();
        }
      });
      setShowConfetti(false);
    }, 2000);
  };

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    const spinCount = 3 + Math.floor(Math.random() * 2);
    const extraDegree = Math.floor(Math.random() * 360);
    const totalDegree = spinCount * 360 + extraDegree;

    const newRotation = rotation + totalDegree;
    setRotation(newRotation);

    setTimeout(() => {
      const finalAngle = newRotation % 360;
      const pointerAngle = (360 - finalAngle + 270) % 360; // Đảo ngược hướng quay
      const winningSliceIndex = Math.floor(pointerAngle / sliceAngle) % discountList.length;
      console.log("Final Angle:", finalAngle, "Pointer Angle:", pointerAngle, "Index:", winningSliceIndex);
      setWinner(discountList[winningSliceIndex].type === 'fixed' ? `You got ${discountList[winningSliceIndex].amount} USD` : `You got ${discountList[winningSliceIndex].amount}%`);
      setDiscountWinId(discountList[winningSliceIndex].id);
      setIsSpinning(false);
      setShowConfetti(true);
      createConfetti();
    }, 5000);
  };
  useEffect(() => {
    if (discountWinId) {
      dispatch(spiningResult({ userId: user.userId, discountId: discountWinId }));
    }
  }, [discountWinId, dispatch, user.userId]);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full" ref={containerRef}>
      <div className="text-3xl font-bold mb-8 text-center text-purple-700">Lucky Wheel</div>

      <div ref={wheelRef} className="relative w-64 h-64 md:w-96 md:h-96 mb-8">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 100 100"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? '5s' : '0s',
            transitionTimingFunction: 'cubic-bezier(0.1, 0.25, 0.1, 1)'
          }}
        >
          {discountList.map((discount, index) => {
            const startAngle = index * sliceAngle;
            const endAngle = startAngle + sliceAngle;
            const midAngle = startAngle + sliceAngle / 2;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = 50 + 50 * Math.cos(startRad);
            const y1 = 50 + 50 * Math.sin(startRad);
            const x2 = 50 + 50 * Math.cos(endRad);
            const y2 = 50 + 50 * Math.sin(endRad);

            const midRad = (midAngle * Math.PI) / 180;
            const textStartX = 50 + 20 * Math.cos(midRad);
            const textStartY = 50 + 20 * Math.sin(midRad);
            const textEndX = 50 + 45 * Math.cos(midRad);
            const textEndY = 50 + 45 * Math.sin(midRad);

            const largeArcFlag = sliceAngle > 180 ? 1 : 0;
            const d = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            const pathId = `textPath-${index}`;

            return (
              <g key={index}>
                <path d={d} fill={"#E91E63"} stroke="#fff" strokeWidth="0.3" />
                <defs>
                  <path id={pathId} d={`M ${textStartX} ${textStartY} L ${textEndX} ${textEndY}`} />
                </defs>
                <text
                  fill="white"
                  fontWeight="bold"
                  fontSize="3.2"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ textShadow: "0 0 1px rgba(0,0,0,0.8)" }}
                >
                  <textPath xlinkHref={`#${pathId}`} startOffset="50%" textAnchor="middle">
                    {discount.type == 'fixed' ? `${discount.amount} USD` : `${discount.amount}%`}
                  </textPath>
                </text>
              </g>
            );
          })}
          <circle cx="50" cy="50" r="5" fill="white" stroke="#ccc" strokeWidth="0.5" />
        </svg>

        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <polygon 
              points="50,44 47.5,48 52.5,48"
              fill="red" 
              stroke="#800" 
              strokeWidth="0.5"
            />
            <line 
              x1="50" 
              y1="48" 
              x2="50" 
              y2="50" 
              stroke="#800" 
              strokeWidth="1.5"
              strokeDasharray="2 1"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="3" 
              fill="red" 
              stroke="#800" 
              strokeWidth="0.5"
            />
          </svg>
        </div>
      </div>

      <button
        className={`px-8 py-3 rounded-full text-xl font-bold text-white transition-all transform hover:scale-105 ${isSpinning ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:shadow-xl'}`}
        onClick={() => {
          spinWheel()
        }}
        disabled={isSpinning}
      >
        {isSpinning ? 'Đang quay...' : 'QUAY NGAY!'}
      </button>

      {winner && (
        <div className="mt-8 text-2xl font-bold text-center">
          <span className="block text-xl">Chúc mừng! Bạn đã trúng: </span>
          <span className="block text-3xl text-purple-600 mt-2">{winner}</span>
        </div>
      )}
    </div>
  );
};

export default LuckyWheel;