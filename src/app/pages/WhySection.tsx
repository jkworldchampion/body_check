import React from 'react';

const WhySection: React.FC = () => {
    return (
        <section
            data-scroll-section=""
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'black',
                color: 'white',
                textAlign: 'center',
                padding: '50px',
            }}
        >
            <h2 style={{ color: 'blue' }}>WHY?</h2>
            <p>
                운동의 중요성은 알지만 어떤 운동을 시작해야할지 막막한 당신을 위해 극한의 효율을 중시하는 현대인들에게
                도움이 되고자 합니다.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                <div style={{ padding: '20px', backgroundColor: 'grey', borderRadius: '10px' }}>
                    <p>어떻게 운동을 해야할지 정말 막막해요.</p>
                </div>
                <div style={{ padding: '20px', backgroundColor: 'grey', borderRadius: '10px' }}>
                    <p>내가 직접 운동을 하면서 바로바로 피드백을 받고싶어요</p>
                </div>
                <div style={{ padding: '20px', backgroundColor: 'grey', borderRadius: '10px' }}>
                    <p>내 기록을 체계적으로 보고싶어요</p>
                </div>
            </div>
        </section>
    );
};

export default WhySection;
