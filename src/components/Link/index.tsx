import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useContext, useEffect, useState } from 'react';
import { mutate } from 'swr';

import { createLink, getLinkDetails, LINK_URL } from '@/apis/Media';
import LinkForm from '@/components/Link/LinkForm';
import LinkView from '@/components/Link/LinkView';
import { MainContext } from '@/store';
import { FormData } from '@/types/media.interface';
import {
  CreateLinkProps,
  CreateLinkResponse,
  GetLinkDetailResponse,
  GetLinkListResponse,
} from '@/types/media.interface';

export default function LinkComponent() {
  const [createLinkResponseData, setCreateLinkResponseData] =
    useState<CreateLinkResponse | null>(null);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const { loginToken } = useContext(MainContext);

  const refreshLinkListCache = (
    accessToken: string,
    createdLinkDetail: GetLinkDetailResponse
  ) => {
    mutate(
      [LINK_URL, accessToken],
      (data: GetLinkListResponse | undefined) => ({
        archiveLinks: [...(data?.archiveLinks || []), createdLinkDetail],
        message: data?.message || '',
      }),
      false
    );
  };

  const createLinkAPI = async (requestData: CreateLinkProps) => {
    const accessToken = loginToken?.accessToken || '';
    const createdLinkResponseData = await createLink(requestData, accessToken);
    const createdLinkId = createdLinkResponseData.id;
    setCreateLinkResponseData(createdLinkResponseData);

    const createdLinkDetail: GetLinkDetailResponse = await getLinkDetails(
      createdLinkId,
      accessToken
    );
    refreshLinkListCache(accessToken, createdLinkDetail);
  };

  const handleFormSubmit = (data: FormData) => {
    if (typeof data === 'object' && data !== null) {
      const requestData: CreateLinkProps = {
        categoryId: data.category || 0,
        url: `${data.linkUrl};${data.thumbnailUrl}`,
        title: data.title,
        description: data.description,
      };
      createLinkAPI(requestData);
    }
  };

  useEffect(() => {
    if (createLinkResponseData) {
      setShowCompletionMessage(true);
      const timer = setTimeout(() => {
        setShowCompletionMessage(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [createLinkResponseData]);

  return (
    <div>
      {createLinkResponseData ? (
        <>
          <LinkView linkId={createLinkResponseData.id} />
          {showCompletionMessage && (
            <MessageBox>
              <MessageText color="white">저장되었습니다.</MessageText>
            </MessageBox>
          )}
        </>
      ) : (
        <LinkForm onSubmit={handleFormSubmit} />
      )}
    </div>
  );
}

const slideUpFadeOutAnimation = keyframes`
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  20% {
    transform: translateY(0);
    opacity: 1;
  }
  70% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(20px);
    opacity: 0;
  }
`;

const MessageBox = styled.div`
  display: flex;
  position: relative;
  bottom: 20px;
  width: 900px;
  background-color: #2d62ea;
  color: white;
  border-radius: 10px;
  height: 40px;
  animation: ${slideUpFadeOutAnimation} 4s ease-in-out;
`;

const MessageText = styled.p`
  color: white;
  font-size: 14px;
  height: 40px;
  display: flex;
  align-items: center;
  margin-left: 20px;
`;
