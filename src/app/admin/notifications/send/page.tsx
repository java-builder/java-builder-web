"use client";

import { useEmailCampaign } from "@/components/admin/notifications/useEmailCampaign";
import EmailPreviewPanel from "@/components/admin/notifications/EmailPreviewPanel";
import {
  AudienceStep,
  ConfigStep,
  ContentStep,
  ScheduleStep,
  StepNav,
} from "@/components/admin/notifications/send";

export default function SendNotificationPage() {
  const c = useEmailCampaign();

  return (
    <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
      {/* Step navigation */}
      <StepNav activeTab={c.activeTab} onChange={c.setActiveTab} />

      {/* Layout: form + preview */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        {/* LEFT: form */}
        <div className="space-y-5 min-w-0 lg:col-span-7">
          {c.activeTab === "config" && (
            <ConfigStep
              subject={c.subject}
              preheader={c.preheader}
              senderName={c.senderName}
              senderEmail={c.senderEmail}
              replyTo={c.replyTo}
              onSubjectChange={c.setSubject}
              onPreheaderChange={c.setPreheader}
              onSenderNameChange={c.setSenderName}
              onSenderEmailChange={c.setSenderEmail}
              onReplyToChange={c.setReplyTo}
              onNext={() => c.setActiveTab("content")}
            />
          )}

          {c.activeTab === "content" && (
            <ContentStep
              selectedTemplate={c.selectedTemplate}
              content={c.content}
              onTemplateChange={c.handleTemplateChange}
              onContentChange={c.setContent}
              onInsertTag={c.insertTag}
              onBack={() => c.setActiveTab("config")}
              onNext={() => c.setActiveTab("audience")}
            />
          )}

          {c.activeTab === "audience" && (
            <AudienceStep
              targetSegment={c.targetSegment}
              selectedUsers={c.selectedUsers}
              users={c.users}
              searchQuery={c.searchQuery}
              isLoadingUsers={c.isLoadingUsers}
              onTargetSegmentChange={c.setTargetSegment}
              onSearchQueryChange={c.setSearchQuery}
              onUserSelect={c.handleUserSelect}
              onSelectAll={c.handleSelectAll}
              onBack={() => c.setActiveTab("content")}
              onNext={() => c.setActiveTab("schedule")}
            />
          )}

          {c.activeTab === "schedule" && (
            <ScheduleStep
              scheduleType={c.scheduleType}
              scheduleDate={c.scheduleDate}
              scheduleTime={c.scheduleTime}
              priority={c.priority}
              isSubmitting={c.isSending}
              onScheduleTypeChange={c.setScheduleType}
              onScheduleDateChange={c.setScheduleDate}
              onScheduleTimeChange={c.setScheduleTime}
              onPriorityChange={c.setPriority}
              onBack={() => c.setActiveTab("audience")}
              onSubmit={() => c.handleSubmit()}
            />
          )}
        </div>

        {/* RIGHT: live preview */}
        <div className="min-w-0 lg:sticky lg:top-6 lg:col-span-5 lg:self-start">
          <EmailPreviewPanel
            previewMode={c.previewMode}
            setPreviewMode={c.setPreviewMode}
            previewHtml={c.previewHtml}
            senderName={c.senderName}
            senderEmail={c.senderEmail}
            subject={c.subject}
            targetSegment={c.targetSegment}
            selectedUsersCount={c.selectedUsers.length}
            currentTemplateCfg={c.currentTemplateCfg}
            systemVarsDetected={c.systemVarsDetected}
            customVarValues={c.customVarValues}
            onCustomVarChange={c.handleCustomVarChange}
          />
        </div>
      </div>
    </div>
  );
}
