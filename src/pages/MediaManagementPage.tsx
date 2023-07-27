import styled from '@emotion/styled';
import { useContext } from 'react';

import Modal from '@/components/Common/Modal';
import LinkComponent from '@/components/Link/index';
import CategorySelector from '@/components/Media/CategorySelector';
import MediaListContainer from '@/components/Media/MediaListContainer';
import { MainContext } from '@/store';

export default function MediaManagementPage() {
  const { mediaModalOpen, setMediaModalState } = useContext(MainContext);

  return (
    <MediaContainer>
      <CategorySelector />
      <MediaListContainer />
      {mediaModalOpen && (
        <Modal
          width={940}
          height={640}
          title={'센터 링크 생성'}
          setIsOpen={setMediaModalState}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <LinkComponent />
          </div>
        </Modal>
      )}
    </MediaContainer>
  );
}

const MediaContainer = styled('div')`
  position: relative;
  margin: 4rem auto 0 auto;
`;
