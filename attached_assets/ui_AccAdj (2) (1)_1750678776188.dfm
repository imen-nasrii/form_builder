inherited frmACCADJ: TfrmACCADJ
  Left = 958
  Top = 105
  Caption = 'Fixed Income Accrual Adjustments'
  ClientHeight = 399
  ClientWidth = 594
  FormStyle = fsMDIChild
  OldCreateOrder = True
  ExplicitWidth = 610
  ExplicitHeight = 437
  PixelsPerInch = 96
  TextHeight = 13
  inherited MainPC: TPageControl
    Width = 594
    Height = 333
    ExplicitWidth = 594
    ExplicitHeight = 333
    inherited tsFields: TTabSheet
      ExplicitLeft = 4
      ExplicitTop = 6
      ExplicitWidth = 586
      ExplicitHeight = 323
      inherited gbReportOptions: TSSIGroupBox
        Left = 274
        Top = 208
        Width = 245
        Height = 105
        Caption = ' Report Options '
        TabOrder = 8
        ExplicitLeft = 274
        ExplicitTop = 208
        ExplicitWidth = 245
        ExplicitHeight = 105
        inherited cbAscii: TSSICheckBox
          Left = 113
          Top = 76
          Visible = False
          ExplicitLeft = 113
          ExplicitTop = 76
        end
        inherited cbPrint: TSSICheckBox
          Left = 12
          Top = 16
          ExplicitLeft = 12
          ExplicitTop = 16
        end
        inherited cbDbf: TSSICheckBox
          Left = 12
          Top = 56
          TabOrder = 4
          Visible = True
          ExplicitLeft = 12
          ExplicitTop = 56
        end
        inherited cbexporttype: TSSIComboBox
          Left = 155
          Top = 52
          Visible = True
          ExplicitLeft = 155
          ExplicitTop = 52
        end
        object cbReportOnly: TSSICheckBox
          Left = 12
          Top = 36
          Width = 144
          Height = 18
          Caption = 'Process Report Only'
          Font.Charset = DEFAULT_CHARSET
          Font.Color = clWindowText
          Font.Height = 15
          Font.Name = 'MS Sans Serif'
          Font.Style = [fsBold]
          ParentFont = False
          TabOrder = 2
          OnClick = cbReportOnlyClick
        end
      end
      object fndlkup1: TMFWFndAliasLookup
        Left = 178
        Top = 4
        Width = 85
        Height = 21
        ClickKey = 115
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        Flat = False
        ParentFlat = False
        ParentFont = False
        TabOrder = 0
        OnChange = fndlkup1Change
        ShowButton = True
        DisplayPanelField = 'ACNAM1'
        GridFont.Charset = DEFAULT_CHARSET
        GridFont.Color = clWindowText
        GridFont.Height = -11
        GridFont.Name = 'MS Sans Serif'
        GridFont.Style = []
        HorzDistanceFromLabel = 6
        HorzDistanceFromPanel = 34
        LabelCaption = 'Fund'
        LabelFont.Charset = DEFAULT_CHARSET
        LabelFont.Color = clWindowText
        LabelFont.Height = -11
        LabelFont.Name = 'MS Sans Serif'
        LabelFont.Style = []
        PanelFont.Charset = DEFAULT_CHARSET
        PanelFont.Color = clWindowText
        PanelFont.Height = -11
        PanelFont.Name = 'MS Sans Serif'
        PanelFont.Style = []
        PanelLength = 190
        PanelTextAlignment = taLeftJustify
        Required = False
        CheckUserAccess = True
        ActiveOnly = False
        GK = False
        MCSC = False
        OnLkupModeChange = fndlkup1LkupModeChange
        LkupMode = lmFund
      end
      object tkrlkup1: TMFWTkrLookup
        Left = 178
        Top = 30
        Width = 85
        Height = 21
        ClickKey = 115
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        Flat = False
        ParentFlat = False
        ParentFont = False
        TabOrder = 1
        OnChange = TkrLkup1Change
        ShowButton = True
        DisplayPanelField = 'TKR_DESC'
        GridFont.Charset = DEFAULT_CHARSET
        GridFont.Color = clWindowText
        GridFont.Height = -11
        GridFont.Name = 'MS Sans Serif'
        GridFont.Style = []
        HorzDistanceFromLabel = 6
        HorzDistanceFromPanel = 10
        LabelCaption = 'Ticker'
        LabelFont.Charset = DEFAULT_CHARSET
        LabelFont.Color = clWindowText
        LabelFont.Height = -11
        LabelFont.Name = 'MS Sans Serif'
        LabelFont.Style = []
        PanelFont.Charset = DEFAULT_CHARSET
        PanelFont.Color = clWindowText
        PanelFont.Height = -11
        PanelFont.Name = 'MS Sans Serif'
        PanelFont.Style = []
        PanelLength = 175
        PanelTextAlignment = taLeftJustify
        Required = False
        ShowActiveOnly = False
      end
      object seccatlkup1: TMFWSccLookup
        Left = 178
        Top = 57
        Width = 85
        Height = 21
        ClickKey = 115
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        Flat = False
        ParentFlat = False
        ParentFont = False
        TabOrder = 2
        ShowButton = True
        DisplayPanelField = 'DESCR'
        GridFont.Charset = DEFAULT_CHARSET
        GridFont.Color = clWindowText
        GridFont.Height = -11
        GridFont.Name = 'MS Sans Serif'
        GridFont.Style = []
        HorzDistanceFromLabel = 6
        HorzDistanceFromPanel = 10
        LabelCaption = 'Security Category'
        LabelFont.Charset = DEFAULT_CHARSET
        LabelFont.Color = clWindowText
        LabelFont.Height = -11
        LabelFont.Name = 'MS Sans Serif'
        LabelFont.Style = []
        PanelFont.Charset = DEFAULT_CHARSET
        PanelFont.Color = clWindowText
        PanelFont.Height = -11
        PanelFont.Name = 'MS Sans Serif'
        PanelFont.Style = []
        PanelLength = 175
        PanelTextAlignment = taLeftJustify
        Required = False
      end
      object secgrplkup1: TMFWScgLookup
        Left = 178
        Top = 83
        Width = 85
        Height = 21
        ClickKey = 115
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        Flat = False
        ParentFlat = False
        ParentFont = False
        TabOrder = 3
        ShowButton = True
        DisplayPanelField = 'DESC1'
        GridFont.Charset = DEFAULT_CHARSET
        GridFont.Color = clWindowText
        GridFont.Height = -11
        GridFont.Name = 'MS Sans Serif'
        GridFont.Style = []
        HorzDistanceFromLabel = 6
        HorzDistanceFromPanel = 10
        LabelCaption = 'Security Group'
        LabelFont.Charset = DEFAULT_CHARSET
        LabelFont.Color = clWindowText
        LabelFont.Height = -11
        LabelFont.Name = 'MS Sans Serif'
        LabelFont.Style = []
        PanelFont.Charset = DEFAULT_CHARSET
        PanelFont.Color = clWindowText
        PanelFont.Height = -11
        PanelFont.Name = 'MS Sans Serif'
        PanelFont.Style = []
        PanelLength = 175
        PanelTextAlignment = taLeftJustify
        Required = False
      end
      object View_Record: TButton
        Left = 3
        Top = 3
        Width = 75
        Height = 25
        Caption = 'View_Record'
        TabOrder = 9
        OnClick = View_RecordClick
      end
      object cbUpDateRates: TSSICheckBox
        Left = 12
        Top = 166
        Width = 264
        Height = 18
        Caption = 'Update Variable Rates Before Processing'
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = 15
        Font.Name = 'MS Sans Serif'
        Font.Style = [fsBold]
        ParentFont = False
        TabOrder = 6
        WordWrap = True
        OnClick = cbUpDateRatesClick
      end
      object cbmbstype: TSSIComboBox
        Left = 178
        Top = 109
        Width = 85
        DropDownCount = 9
        ParentCtl3D = False
        TabOrder = 4
        OnKeyDown = CBMBSTypeKeyDown
        Items.Strings = (
          'GNMA I'
          'GNMA II'
          'FNMA'
          'FHLMC'
          'CMO'
          'PO'
          'IO'
          'GPM')
        LabelCaption = 'MBS Pool Type'
      end
      object rgAccrualFlag: TSsiRadioGroup
        Left = 78
        Top = 208
        Width = 185
        Height = 75
        Caption = ' Interest Accrual Type '
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = 11
        Font.Name = 'MS Sans Serif'
        Font.Style = [fsBold]
        ItemIndex = 0
        Items.Strings = (
          'All'
          'Fixed'
          'Variable')
        ParentCtl3D = False
        ParentFont = False
        TabOrder = 7
      end
      object deaccrualdate: TGisDateEdit
        Left = 178
        Top = 136
        Width = 85
        Height = 21
        CalendarProperties.Color = clWhite
        CalendarProperties.HelpContext = 0
        CalendarProperties.SaturdayColor = clBlack
        CalendarProperties.SundayColor = clBlack
        CalendarProperties.WeekOfYearColor = clBlack
        CalendarProperties.AutoChooseLastDay = False
        Color = clAqua
        Ctl3D = True
        EditMask = '!99/99/9999;1;_'
        Font.Charset = DEFAULT_CHARSET
        Font.Color = clWindowText
        Font.Height = -11
        Font.Name = 'MS Sans Serif'
        Font.Style = []
        Info = False
        ParentCtl3D = False
        ParentFont = False
        Spin = False
        TabOrder = 5
        Visible = False
        Required = True
        LabelCaption = 'Process Through'
        LabelFont.Charset = DEFAULT_CHARSET
        LabelFont.Color = clWindowText
        LabelFont.Height = 11
        LabelFont.Name = 'MS Sans Serif'
        LabelFont.Style = [fsBold]
        LabelXAdjust = 6
        LabelYAdjust = -3
      end
      object gisAFSelect1: TgisAsOfFileDateEdit
        Left = 274
        Top = 109
        Width = 245
        Height = 84
        TabOrder = 15
        AsOfCaption = ' Process Against '
        RadioGrp_Plane = aorpVertical
        OnChange = gisAFSelect1Change
        AsOfDateEnabled = False
      end
    end
    inherited tsValidate: TTabSheet
      ExplicitWidth = 586
      ExplicitHeight = 323
      inherited ErrList: TListBox
        Width = 586
        Height = 323
        ExplicitWidth = 586
        ExplicitHeight = 323
      end
    end
    inherited tsLifeSigns: TTabSheet
      ExplicitLeft = 4
      ExplicitTop = 6
      ExplicitWidth = 586
      ExplicitHeight = 323
    end
  end
  inherited btnStatusPanel: TPanel
    Top = 333
    Width = 594
    ExplicitTop = 333
    ExplicitWidth = 594
    inherited Panel1: TPanel
      Width = 594
      ExplicitWidth = 594
      inherited btnLast: TfcShapeBtn
        Left = 259
        ExplicitLeft = 259
      end
      inherited btnSchedule: TfcShapeBtn
        Left = 259
        Visible = True
        ExplicitLeft = 259
      end
      inherited btnNext: TfcShapeBtn
        Left = 177
        ExplicitLeft = 177
      end
      inherited btnBack: TfcShapeBtn
        Left = 95
        ExplicitLeft = 95
      end
      inherited btnCancel: TfcShapeBtn
        Left = 423
        Width = 81
        ExplicitLeft = 423
        ExplicitWidth = 81
      end
      inherited btnOk: TfcShapeBtn
        Left = 341
        ExplicitLeft = 341
      end
      inherited btnViewPrev: TfcShapeBtn
        Left = 12
        ExplicitLeft = 12
      end
      inherited mfHlpBtn1: TmfHlpBtn
        Left = 505
        Width = 81
        ExplicitLeft = 505
        ExplicitWidth = 81
      end
    end
    inherited sBar: TStatusBar
      Width = 594
      ExplicitWidth = 594
    end
  end
  inherited SOAPMsgTimer: TTimer
    Left = 14
    Top = 42
  end
  inherited popLoadMemData: TPopupMenu
    Left = 12
    Top = 98
  end
end
