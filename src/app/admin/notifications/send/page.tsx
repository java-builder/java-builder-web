"use client";

import { useEffect } from "react";
import { useEmailCampaign } from "@/components/admin/notifications/useEmailCampaign";
import EmailPreviewPanel from "@/components/admin/notifications/EmailPreviewPanel";
import {
  AudienceStep,
  ContentStep,
  ModeStep,
  ScheduleStep,
  StepNav,
} from "@/components/admin/notifications/send";

export default function SendNotificationPage() {
  const c = useEmailCampaign();

  // Tự động cuộn lên đầu trang mỗi khi chuyển bước (tránh tình trạng phải tự lướt lên)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [c.activeTab]);

  return (
    <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
      {/* Step navigation with access guards */}
      <StepNav
        activeTab={c.activeTab}
        onChange={c.setActiveTab}
        canAccessTab={c.canAccessTab}
      />

      {/* Layout: form + preview */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        {/* LEFT: form */}
        <div className="space-y-5 min-w-0 lg:col-span-7">
          {/* STEP 1: Chọn hình thức (Mode) */}
          {c.activeTab === "mode" && (
            <ModeStep
              campaignMode={c.campaignMode}
              onSelectMode={c.handleSelectMode}
              selectedTemplate={c.selectedTemplate}
              templates={c.campaignTemplates}
              isLoadingTemplates={c.isLoadingTemplates}
              onSelectCustom={c.selectCustomAndProceed}
              onSelectTemplate={c.selectTemplateAndProceed}
            />
          )}

          {/* STEP 2: Nội dung & Cấu hình (Content & Config) */}
          {c.activeTab === "content" && (
            <ContentStep
              campaignMode={c.campaignMode}
              currentTemplateCfg={c.currentTemplateCfg}
              subject={c.subject}
              preheader={c.preheader}
              senderName={c.senderName}
              senderEmail={c.senderEmail}
              replyTo={c.replyTo}
              content={c.content}
              customVarValues={c.customVarValues}
              onSubjectChange={c.setSubject}
              onPreheaderChange={c.setPreheader}
              onSenderNameChange={c.setSenderName}
              onSenderEmailChange={c.setSenderEmail}
              onReplyToChange={c.setReplyTo}
              onContentChange={c.setContent}
              onCustomVarChange={c.handleCustomVarChange}
              onInsertTag={c.insertTag}
              onChangeModeClick={() => c.setActiveTab("mode")}
              onBack={() => c.setActiveTab("mode")}
              onNext={c.handleNextFromContent}
            />
          )}

          {/* STEP 3: Người nhận (Audience) */}
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
              onNext={c.handleNextFromAudience}
            />
          )}

          {/* STEP 4: Lập lịch (Schedule) */}
          {c.activeTab === "schedule" && (
            <ScheduleStep
              scheduleType={c.scheduleType}
              scheduleDate={c.scheduleDate}
              scheduleTime={c.scheduleTime}
              isSubmitting={c.isSending}
              onScheduleTypeChange={c.setScheduleType}
              onScheduleDateChange={c.setScheduleDate}
              onScheduleTimeChange={c.setScheduleTime}
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
          />
        </div>
      </div>
    </div>
  );
}
