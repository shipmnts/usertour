import * as Popover from '@radix-ui/react-popover';
import { Input } from '@usertour-ui/input';
import { Label } from '@usertour-ui/label';
import { QuestionTooltip } from '@usertour-ui/tooltip';
import { RulesCondition } from '@usertour-ui/types';
import { useCallback, useState } from 'react';
import { ContentActions } from '../..';
import { useContentEditorContext } from '../../contexts/content-editor-context';
import { ContentEditorScaleElement } from '../../types/editor';
import { Button } from '@usertour-ui/button';

// Define Scale element type

const buttonBaseClass =
  'flex items-center overflow-hidden group font-semibold relative border border-sdk-question hover:bg-sdk-question/30 rounded-md main-transition p-2 py-2 text-base justify-center';

export const ContentEditorScale = (props: {
  element: ContentEditorScaleElement;
  id: string;
  path: number[];
}) => {
  const { element, id } = props;
  const {
    updateElement,
    zIndex,
    currentStep,
    currentVersion,
    attributes,
    contentList,
    createStep,
  } = useContentEditorContext();
  const [isOpen, setIsOpen] = useState<boolean>();

  // Handle question text change
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateElement(
        {
          ...element,
          data: { ...element.data, name: e.target.value },
        },
        id,
      );
    },
    [element, id],
  );

  const handleActionChange = (actions: RulesCondition[]) => {
    updateElement({ ...element, data: { ...element.data, actions } }, id);
  };

  const handleLabelChange = (value: string, key: string) => {
    updateElement({ ...element, data: { ...element.data, [key]: value } }, id);
  };

  const scaleLength = element.data.highRange - element.data.lowRange + 1;

  return (
    <Popover.Root modal={true} onOpenChange={setIsOpen} open={isOpen}>
      <Popover.Trigger asChild>
        <div>
          <div
            className="grid gap-1.5 !gap-1"
            style={{
              gridTemplateColumns: `repeat(${scaleLength}, minmax(0px, 1fr))`,
            }}
          >
            {Array.from({ length: scaleLength }, (_, i) => (
              <Button key={i} className={buttonBaseClass} forSdk>
                {element.data.lowRange + i}
              </Button>
            ))}
          </div>
          {(element.data.lowLabel || element.data.highLabel) && (
            <div className="flex mt-2.5 px-0.5 text-[13px] items-center justify-between opacity-80">
              <p>{element.data.lowLabel}</p>
              <p>{element.data.highLabel}</p>
            </div>
          )}
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-72 rounded-md border bg-background p-4"
          style={{ zIndex }}
        >
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="scale-question">Question name</Label>
            <Input
              id="scale-question"
              value={element.data.name}
              onChange={handleNameChange}
              placeholder="Question name?"
            />
            <Label>When answer is submitted</Label>
            <ContentActions
              zIndex={zIndex}
              isShowIf={false}
              isShowLogic={false}
              currentStep={currentStep}
              currentVersion={currentVersion}
              onDataChange={handleActionChange}
              defaultConditions={element?.data?.actions || []}
              attributes={attributes}
              contents={contentList}
              createStep={createStep}
            />
            <Label className="flex items-center gap-1">Scale range</Label>
            <div className="flex flex-row gap-2 items-center">
              <Input
                type="number"
                value={element.data.lowRange}
                placeholder="Default"
                onChange={(e) => handleLabelChange(e.target.value, 'lowRange')}
              />
              <p>-</p>
              <Input
                type="number"
                value={element.data.highRange}
                placeholder="Default"
                onChange={(e) => handleLabelChange(e.target.value, 'highRange')}
              />
            </div>
            <Label className="flex items-center gap-1">
              Labels
              <QuestionTooltip>
                Below each option, provide labels to clearly convey their meaning, such as "Bad"
                positioned under the left option and "Good" under the right.
              </QuestionTooltip>
            </Label>
            <div className="flex flex-row gap-2">
              <Input
                type="text"
                value={element.data.lowLabel}
                placeholder="Default"
                onChange={(e) => handleLabelChange(e.target.value, 'lowLabel')}
              />
              <Input
                type="text"
                value={element.data.highLabel}
                placeholder="Default"
                onChange={(e) => handleLabelChange(e.target.value, 'highLabel')}
              />
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

ContentEditorScale.displayName = 'ContentEditorScale';

export type ContentEditorScaleSerializeType = {
  className?: string;
  children?: React.ReactNode;
  element: ContentEditorScaleElement;
  onClick?: (element: ContentEditorScaleElement) => void;
};

export const ContentEditorScaleSerialize = (props: ContentEditorScaleSerializeType) => {
  const { element } = props;

  const scaleLength = element.data.highRange - element.data.lowRange + 1;

  return (
    <>
      <div>
        <div
          className="grid gap-1.5 !gap-1"
          style={{
            gridTemplateColumns: `repeat(${scaleLength}, minmax(0px, 1fr))`,
          }}
        >
          {Array.from({ length: scaleLength }, (_, i) => (
            <Button key={i} className={buttonBaseClass} forSdk>
              {element.data.lowRange + i}
            </Button>
          ))}
        </div>
        {(element.data.lowLabel || element.data.highLabel) && (
          <div className="flex mt-2.5 px-0.5 text-[13px] items-center justify-between opacity-80">
            <p>{element.data.lowLabel}</p>
            <p>{element.data.highLabel}</p>
          </div>
        )}
      </div>
    </>
  );
};

ContentEditorScaleSerialize.displayName = 'ContentEditorScaleSerialize';
